import { db } from "@/lib/db";
import { workshops, payments, workshopRegistrations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { StripeService } from "./stripe-service";
import { EmailService } from "./email-service";

/**
 * WorkshopsService
 * Implements the "Professional Blueprint" logic for workshop registration.
 * Adapted from NestJS/Prisma example to Next.js/Drizzle.
 */
export class WorkshopsService {
    private stripe: StripeService;
    private email: EmailService;

    constructor() {
        // In a real NestJS app, these would be injected.
        // Here we instantiate them as singletons or helpers.
        this.stripe = new StripeService();
        this.email = new EmailService();
    }

    async registerForWorkshop(userId: string, workshopId: string, paymentMethodId?: string): Promise<any> {
        // 1. Fetch user and workshop data
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });
        const workshop = await db.query.workshops.findFirst({
            where: eq(workshops.id, workshopId)
        });

        if (!user || !workshop) {
            throw new Error('User or Workshop not found.');
        }

        // 2. Handle the logic for paid vs. free workshops.
        if (!workshop.isFree) {
            // --- PAID WORKSHOP --- //
            if (!paymentMethodId) {
                throw new Error('Payment method is required for paid workshops.');
            }

            // Use a database transaction
            return await db.transaction(async (tx) => {
                // a. Create a payment record in 'pending' state.
                const [payment] = await tx.insert(payments).values({
                    userId: user.id,
                    amount: workshop.price,
                    currency: workshop.currency || 'USD',
                    status: 'pending',
                    provider: 'stripe',
                }).returning();

                try {
                    // b. Attempt to charge the user via Stripe.
                    const charge = await this.stripe.createCharge(
                        user.email,
                        workshop.price,
                        paymentMethodId,
                        `Workshop: ${workshop.title}`
                    );

                    // c. If successful, update payment and create registration
                    await tx.update(payments)
                        .set({ status: 'succeeded', providerPaymentId: charge.id })
                        .where(eq(payments.id, payment.id));

                    const [registration] = await tx.insert(workshopRegistrations).values({
                        userId: user.id,
                        workshopId: workshop.id,
                        paymentId: payment.id
                    }).returning();

                    // d. Send confirmation email (after transaction ideally, but here for flow)
                    // Note: In Drizzle transaction, if email fails, we might not want to rollback payment? 
                    // The blueprint says "out of the transaction scope for performance", which is correct.
                    // We'll return the registration and send email after.

                    return { success: true, registration, workshop, user };

                } catch (error: any) {
                    // e. Payment failed
                    await tx.update(payments)
                        .set({ status: 'failed' })
                        .where(eq(payments.id, payment.id));

                    throw new Error(`Payment failed: ${error.message}`);
                }
            }).then(async (result) => {
                // Out of transaction scope
                await this.email.sendWorkshopConfirmation(result.user, result.workshop);
                return result;
            });

        } else {
            // --- FREE WORKSHOP --- //
            const [registration] = await db.insert(workshopRegistrations).values({
                userId: user.id,
                workshopId: workshop.id
            }).returning();

            await this.email.sendWorkshopConfirmation(user, workshop);

            return { success: true, registration };
        }
    }
}
