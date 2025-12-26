import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(ThrottlerGuard)
    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @UseGuards(ThrottlerGuard)
    @Post('reset-password')
    async resetPassword(@Body() body: { token: string; password: string }) {
        return this.authService.resetPassword(body.token, body.password);
    }

    @UseGuards(ThrottlerGuard) // Rate limiting
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(createUserDto);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }

    @UseGuards(ThrottlerGuard) // Rate limiting
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: AuthDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(data);

        if ('mfaRequired' in result) {
            return result; // Wrapper { mfaRequired: true, mfaToken: ... }
        }

        // Implicitly result is Tokens
        const tokens = result as any;
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }

    @Post('login/mfa')
    @HttpCode(HttpStatus.OK)
    async loginMfa(@Body() body: { mfaToken: string; code: string }, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.loginMfa(body.mfaToken, body.code);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as any;
        const refreshToken = req.cookies['refresh_token'];
        await this.authService.logout(user.userId, refreshToken);
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req['user'] as any;
        const tokens = await this.authService.refreshTokens(user['sub'], user['refreshToken']);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Req() req: Request) {
        const user = req.user as any;
        return this.authService.getProfile(user.userId);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const user = req.user as any;
        const tokens = await this.authService.getTokens(user.id, user.email, user.role);
        await this.authService.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken, "Google Login");
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        const frontendUrl = process.env.FRONTEND_URL || 'https://mumayazone.com';
        res.redirect(`${frontendUrl}/en/admin/dashboard`);
    }

    private setRefreshTokenCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'lax', // Or 'strict'
            path: '/', // Allow usage on all routes (Middleware needs it)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
}
