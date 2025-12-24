import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class MfaService {
    constructor(private configService: ConfigService) {
        // Optional: authenticator.options = { step: 30, window: 1 };
    }

    async generateMfaSecret(email: string) {
        const secret = authenticator.generateSecret();
        const appName = 'Mqudah Platform';
        const otpAuthUrl = authenticator.keyuri(email, appName, secret);

        return {
            secret,
            otpAuthUrl,
        };
    }

    async generateQrCode(otpAuthUrl: string) {
        return QRCode.toDataURL(otpAuthUrl);
    }

    verifyMfaToken(token: string, secret: string) {
        return authenticator.verify({
            token,
            secret,
        });
    }
}
