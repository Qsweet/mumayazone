import { Body, Controller, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';

@Controller('auth/mfa')
export class MfaController {
    constructor(
        private mfaService: MfaService,
        private prisma: PrismaService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('setup')
    async setupMfa(@Req() req: Request) {
        const user = req.user as any;
        const { secret, otpAuthUrl } = await this.mfaService.generateMfaSecret(user.email);
        const qrCodeUrl = await this.mfaService.generateQrCode(otpAuthUrl);

        return {
            secret, // Needed for 'enable' step if we don't store temp
            qrCodeUrl,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('enable')
    async enableMfa(@Req() req: Request, @Body() body: { code: string; secret: string }) {
        const user = req.user as any;
        const isValid = this.mfaService.verifyMfaToken(body.code, body.secret);

        if (!isValid) throw new UnauthorizedException('Invalid MFA token');

        // Upsert settings
        await this.prisma.mfaSetting.upsert({
            where: { userId: user.userId },
            update: {
                isEnabled: true,
                secret: body.secret,
                type: 'TOTP',
            },
            create: {
                userId: user.userId,
                isEnabled: true,
                secret: body.secret,
                type: 'TOTP',
            }
        });

        // Update User denormalized flag
        await this.prisma.user.update({
            where: { id: user.userId },
            data: { isMfaEnabled: true }
        });

        return { message: 'MFA Enabled Successfully' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('disable')
    async disableMfa(@Req() req: Request, @Body() body: { code: string }) {
        const user = req.user as any;

        // Fetch current secret
        const settings = await this.prisma.mfaSetting.findUnique({ where: { userId: user.userId } });
        if (!settings || !settings.isEnabled) return { message: 'MFA already disabled' };

        const isValid = this.mfaService.verifyMfaToken(body.code, settings.secret);
        if (!isValid) throw new UnauthorizedException('Invalid MFA token');

        await this.prisma.mfaSetting.update({
            where: { userId: user.userId },
            data: { isEnabled: false }
        });

        await this.prisma.user.update({
            where: { id: user.userId },
            data: { isMfaEnabled: false }
        });

        return { message: 'MFA Disabled' };
    }
}
