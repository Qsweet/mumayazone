export class StripeService {
    async createCharge(email: string, amount: number, paymentMethodId: string, description: string) {
        // Mock Stripe implementation
        console.log(`[Stripe] Charging ${email} ${amount} via ${paymentMethodId}: ${description}`);

        // Simulate success
        return {
            id: `ch_${crypto.randomUUID()}`,
            status: 'succeeded'
        };
    }
}
