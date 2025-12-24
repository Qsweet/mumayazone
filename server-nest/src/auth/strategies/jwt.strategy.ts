import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        const secret = config.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            console.error('CRITICAL: JWT_ACCESS_SECRET missing. Env keys:', Object.keys(process.env));
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret || 'debug-fallback-secret',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
