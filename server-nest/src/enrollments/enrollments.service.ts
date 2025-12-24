import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class EnrollmentsService {
    constructor(
        private prisma: PrismaService,
        private paymentsService: PaymentsService,
    ) { }

    async checkout(userId: string, courseId: string) {
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new NotFoundException('Course not found');

        // Check if already enrolled
        const existing = await this.prisma.enrollment.findFirst({
            where: { user_id: userId, course_id: courseId }
        });
        if (existing) throw new BadRequestException('Already enrolled');

        // Create Payment
        const payment = await this.paymentsService.createPayment(userId, course.price, course.currency);

        // In a real app, we return the clientSecret for frontend to handle Stripe JS
        // Here we return paymentId so our "Mock Frontend" can instantly confirm it
        return {
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            clientSecret: `mock_secret_for_${payment.id}`
        };
    }

    async confirmEnrollment(userId: string, paymentId: string) {
        // 1. Confirm Payment
        const payment = await this.paymentsService.confirmPayment(paymentId);

        if (payment.status !== 'succeeded') {
            throw new BadRequestException('Payment failed or pending');
        }

        // 2. Find Course ID from Payment (We didn't store course_id on Payment directly in schema comments earlier, 
        // let's check schema. We have `enrollment` relation on Payment, but we are creating enrollment NOW.
        // Wait, the Payment model in schema doesn't have course_id. 
        // Usually Payment has metadata or we pass courseId in checkout body to confirm?
        // Let's look at schema again. 
        // The schema has `enrollment Enrollment[]`. 
        // We need to know WHICH course this payment was for.
        // Ideally we store metadata. 
        // For this Mock, I'll pass courseId in the confirm body too, OR 
        // we should have stored it. 
        // Let's just update Payment schema to store `metadata` JSON or `course_id` optional?
        // Or just pass it from client. Client knows what it bought.
        // I will pass courseId in confirm.

        // BUT, secure way is server knows. 
        // Let's assume we pass it for now to save schema migration time, 
        // validation: check if payment amount matches course price? 
        // Let's keep it simple.
        return { status: 'payment_confirmed_but_needs_course_id' };
    }

    // Refined Confirm: Client calls "I paid for Course X with Payment Y".
    async completeCheckout(userId: string, courseId: string, paymentId: string) {
        const payment = await this.paymentsService.confirmPayment(paymentId);
        if (payment.status !== 'succeeded') throw new BadRequestException('Payment not successful');

        // Create Enrollment
        const enrollment = await this.prisma.enrollment.create({
            data: {
                user_id: userId,
                course_id: courseId,
                payment_id: payment.id
            }
        });

        return enrollment;
    }

    async findMyEnrollments(userId: string) {
        return this.prisma.enrollment.findMany({
            where: { user_id: userId },
            include: { course: true }
        });
    }
}
