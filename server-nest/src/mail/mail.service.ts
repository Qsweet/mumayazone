import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new Resend(apiKey);
        } else {
            this.logger.warn('RESEND_API_KEY not found. Emails will be logged to console.');
        }
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
        const subject = 'Verify your email';
        const html = `<p>Click <a href="${url}">here</a> to verify your email.</p>`;

        if (this.resend) {
            await this.resend.emails.send({
                from: 'Mqudah Academy <onboarding@resend.dev>', // Update with verified domain
                to: email,
                subject,
                html,
            });
            this.logger.log(`Verification email sent to ${email}`);
        } else {
            this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: ${subject} | Link: ${url}`);
        }
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
        const subject = 'Reset your password';
        const html = `<p>Click <a href="${url}">here</a> to reset your password.</p>`;

        if (this.resend) {
            await this.resend.emails.send({
                from: 'Mqudah Academy <support@resend.dev>',
                to: email,
                subject,
                html,
            });
            this.logger.log(`Password reset email sent to ${email}`);
            // TODO: Remove this log in production, kept for E2E testing without inbox access
            this.logger.log(`[DEBUG] Reset Link: ${url}`);
        } else {
            this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: ${subject} | Link: ${url}`);
        }
    }
}
