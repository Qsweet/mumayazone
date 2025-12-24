import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @Post('checkout/:courseId')
    @UseGuards(AuthGuard('jwt'))
    checkout(@Param('courseId') courseId: string, @Req() req: any) {
        return this.enrollmentsService.checkout(req.user.userId, courseId);
    }

    @Post('confirm')
    @UseGuards(AuthGuard('jwt'))
    confirm(@Body() body: { courseId: string, paymentId: string }, @Req() req: any) {
        return this.enrollmentsService.completeCheckout(req.user.userId, body.courseId, body.paymentId);
    }

    @Get('my')
    @UseGuards(AuthGuard('jwt'))
    myEnrollments(@Req() req: any) {
        return this.enrollmentsService.findMyEnrollments(req.user.userId);
    }
}
