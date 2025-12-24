import { Injectable } from '@nestjs/common';

@Injectable()
export class MockPaymentProvider {
    async createPaymentIntent(amount: number, currency: string) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            providerId: `mock_pi_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            clientSecret: `mock_secret_${Date.now()}`,
            status: 'requires_payment_method',
        };
    }

    async verifyPayment(providerId: string) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Always succeed for now
        return {
            status: 'succeeded',
            providerId,
        };
    }
}
