import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MockPaymentProvider } from './mock-payment.provider';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private paymentProvider: MockPaymentProvider,
    ) { }

    async createPayment(userId: string, amount: number, currency: string = 'USD') {
        // 1. Call Provider
        const intent = await this.paymentProvider.createPaymentIntent(amount, currency);

        // 2. Save to DB
        return this.prisma.payment.create({
            data: {
                amount,
                currency,
                status: 'pending',
                provider: 'mock',
                provider_payment_id: intent.providerId,
                user_id: userId,
            },
        });
    }

    async confirmPayment(paymentId: string) {
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment || !payment.provider_payment_id) throw new Error('Invalid Payment');

        // Verify with provider
        const result = await this.paymentProvider.verifyPayment(payment.provider_payment_id);

        if (result.status === 'succeeded') {
            return this.prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'succeeded' },
            });
        }

        return payment;
    }
}
