import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refresh_token;
                },
            ]),
            secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        } as StrategyOptionsWithRequest); // Cast to fix type error
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return { ...payload, refreshToken };
    }
}
