import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto'; // Use the main one
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto'; // Assuming this exists or needed
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
        private prisma: PrismaService,
    ) { }

    async forgotPassword(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) return; // Silent fail for security

        // Generate Reset Token (Short lived, 15m)
        const token = this.jwtService.sign(
            { sub: user.id, purpose: 'reset_password' },
            {
                secret: this.configService.get('JWT_ACCESS_SECRET'), // Ideally change to separate secret
                expiresIn: '15m'
            }
        );

        await this.mailService.sendPasswordResetEmail(user.email, token);
        return { message: 'If email exists, reset link sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET')
            });
        } catch { throw new ForbiddenException('Invalid or Expired Token'); }

        if (payload.purpose !== 'reset_password') throw new ForbiddenException('Invalid Token Purpose');

        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new ForbiddenException('User not found');

        const hashedPassword = await this.hashData(newPassword);
        await this.usersService.update(user.id, { password_hash: hashedPassword });

        return { message: 'Password updated successfully' };
    }

    async register(createUserDto: CreateUserDto) {
        const existing = await this.usersService.findOne(createUserDto.email);
        if (existing) throw new ForbiddenException('User already exists');

        const hashedPassword = await this.hashData(createUserDto.password);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken);

        // Send verification email (Mock logic for now until Resend key is set)
        // We can use a signed JWT as a verification token too
        const verificationToken = this.jwtService.sign(
            { sub: user.id },
            { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: '1d' },
        );
        await this.mailService.sendVerificationEmail(user.email, verificationToken);

        return tokens;
    }

    async login(data: AuthDto) {
        const user = await this.usersService.findOne(data.email);
        if (!user) throw new ForbiddenException('Access Denied');

        const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
        if (!passwordMatches) throw new ForbiddenException('Access Denied');

        // MFA Check
        if (user.isMfaEnabled) {
            // Generate temporary MFA token
            const mfaToken = this.jwtService.sign(
                { sub: user.id, isMfaPending: true },
                {
                    secret: this.configService.get('JWT_ACCESS_SECRET'), // Or dedicated secret
                    expiresIn: '5m' // Short lived
                }
            );
            return {
                mfaRequired: true,
                mfaToken,
            };
        }

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken);
        return tokens;
    }

    async loginMfa(mfaToken: string, code: string) {
        // Verify token
        let payload;
        try {
            payload = this.jwtService.verify(mfaToken, {
                secret: this.configService.get('JWT_ACCESS_SECRET')
            });
        } catch { throw new ForbiddenException('Invalid MFA Attempt'); }

        if (!payload.isMfaPending || !payload.sub) throw new ForbiddenException('Invalid MFA Token');

        const userId = payload.sub;
        const user = await this.usersService.findById(userId);
        if (!user) throw new ForbiddenException('User not found');

        // Verify Code
        const mfaSettings = await this.prisma.mfaSetting.findUnique({ where: { userId } });
        if (!mfaSettings || !mfaSettings.isEnabled) {
            // Weird state: User has flag but no settings? Or disabled mid-flight?
            // Allow login or fail? Fail for security.
            throw new ForbiddenException('MFA configuration error');
        }

        // We need MfaService here but circular dependency might be an issue if we inject it.
        // Better to inject MfaService or use authenticator directly.
        // Since AuthService is already heavy, better to use authenticator directly or inject MfaService.
        // I'll import authenticator from 'otplib'.
        const { authenticator } = require('otplib');
        const isValid = authenticator.verify({
            token: code,
            secret: mfaSettings.secret
        });

        if (!isValid) throw new ForbiddenException('Invalid OTP Code');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken, "MFA Login Session");
        return tokens;
    }

    async logout(userId: string, refreshToken?: string) {
        if (!refreshToken) return; // Can't revoke specific token without it.
        // Decode to get JTI
        // We assume token might be valid or expired, checking structure only
        const decoded = this.jwtService.decode(refreshToken) as any;
        if (decoded && decoded.jti) {
            await this.prisma.refreshToken.update({
                where: { id: decoded.jti },
                data: { revokedAt: new Date() }
            }).catch(() => { }); // Ignore if already not found
        }
    }

    async refreshTokens(userId: string, rt: string) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(rt, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
        } catch (e) { throw new ForbiddenException('Access Denied'); }

        const tokenId = payload.jti;
        if (!tokenId) throw new ForbiddenException('Invalid Token');

        const tokenRow = await this.prisma.refreshToken.findUnique({ where: { id: tokenId } });
        if (!tokenRow) throw new ForbiddenException('Access Denied');

        if (tokenRow.revokedAt) {
            // Reuse Detection: Revoke all tokens for this user
            await this.prisma.refreshToken.updateMany({
                where: { userId },
                data: { revokedAt: new Date() }
            });
            throw new ForbiddenException('Access Denied - Token Reuse');
        }

        const tokens = await this.getTokens(userId, payload.email, payload.role);

        // Rotate: Revoke Old, Create New
        await this.prisma.$transaction([
            this.prisma.refreshToken.update({
                where: { id: tokenId },
                data: {
                    revokedAt: new Date(),
                    replacedByTokenId: tokens.refreshTokenId
                }
            }),
            this.prisma.refreshToken.create({
                data: {
                    id: tokens.refreshTokenId,
                    userId,
                    tokenHash: await this.hashData(tokens.refreshToken),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    deviceInfo: "Refreshed Session",
                }
            })
        ]);

        return tokens;
    }

    async saveRefreshToken(userId: string, tokenId: string, refreshToken: string, deviceInfo?: string) {
        const hash = await this.hashData(refreshToken);
        await this.prisma.refreshToken.create({
            data: {
                id: tokenId,
                userId,
                tokenHash: hash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                deviceInfo: deviceInfo || "Login Session",
            }
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hash = await this.hashData(refreshToken);
        await this.usersService.setCurrentRefreshToken(hash, userId);
    }

    hashData(data: string) {
        return bcrypt.hash(data, 12);
    }

    async getTokens(userId: string, email: string, role: string) {
        const tokenId = crypto.randomUUID();
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email, role },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email, role, jti: tokenId },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
            refreshTokenId: tokenId,
        };
    }

    async validateSocialUser(provider: 'GOOGLE' | 'GITHUB', profile: any) {
        // profile.id, profile.emails[0].value, profile.displayName
        const email = profile.emails[0].value;
        const providerId = profile.id;

        // 1. Check if Social Account exists
        const existingSocial = await this.prisma.socialAccount.findUnique({
            where: {
                provider_providerId: {
                    provider,
                    providerId,
                }
            },
            include: { user: true },
        });

        if (existingSocial) return existingSocial.user;

        // 2. Check if User exists by email (Link account)
        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            await this.prisma.socialAccount.create({
                data: {
                    userId: existingUser.id,
                    provider,
                    providerId,
                }
            });
            return existingUser;
        }

        // 3. Create New User
        // Generate random password (they can reset it later if they want password login)
        const tempPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await this.hashData(tempPassword);

        const newUser = await this.usersService.create({
            email,
            name: profile.displayName || email.split('@')[0],
            password: hashedPassword,
            role: UserRole.STUDENT,
        });

        // Auto-verify social users
        await this.prisma.user.update({
            where: { id: newUser.id },
            data: { isVerified: true }
        });

        await this.prisma.socialAccount.create({
            data: {
                userId: newUser.id,
                provider,
                providerId,
            }
        });

        return newUser;
    }

    async getProfile(userId: string) {
        return this.usersService.findById(userId);
    }
}
