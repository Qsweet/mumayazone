import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserRole } from '../src/users/dto/create-user.dto';

describe('Enrollment System (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        app.use(cookieParser());
        await app.init();

        prisma = app.get(PrismaService);

        // Clean up
        await prisma.enrollment.deleteMany();
        await prisma.payment.deleteMany();
        await prisma.lesson.deleteMany();
        await prisma.contentModule.deleteMany();
        await prisma.course.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });

    const instructorUser = {
        name: 'Instructor',
        email: 'inst@enroll.com',
        password: 'Password123!',
        role: UserRole.INSTRUCTOR,
    };

    const studentUser = {
        name: 'Student',
        email: 'student@enroll.com',
        password: 'Password123!',
    };

    let instructorToken: string;
    let studentToken: string;
    let courseId: string;
    let paymentId: string;

    it('Setup: Register Users', async () => {
        // Instructor
        const res1 = await request(app.getHttpServer())
            .post('/auth/register')
            .send(instructorUser)
            .expect(201);
        instructorToken = res1.body.accessToken;

        // Student
        const res2 = await request(app.getHttpServer())
            .post('/auth/register')
            .send(studentUser)
            .expect(201);
        studentToken = res2.body.accessToken;
    });

    it('Setup: Create Course', async () => {
        const res = await request(app.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({
                title: 'Paid Course',
                slug: 'paid-course',
                description: 'Worth it',
                price: 1000, // $10.00
            })
            .expect(201);
        courseId = res.body.id;
    });

    it('Example: Student cannot access un-enrolled course content (if we hid it)', async () => {
        // For now, course GET is public, but let's say we check enrollment status
        // implementation pending on GET /courses/:slug logic to hide modules? 
        // Currently logic is: GET /courses/:slug shows all. 
        // We haven't implemented "Hiding content" yet.
        // Let's test the Checkout flow.
    });

    it('Checkout (POST /enrollments/checkout/:courseId)', async () => {
        const res = await request(app.getHttpServer())
            .post(`/enrollments/checkout/${courseId}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .expect(201);

        expect(res.body.paymentId).toBeDefined();
        expect(res.body.amount).toBe(1000);
        paymentId = res.body.paymentId;
    });

    it('Confirm Payment (POST /enrollments/confirm)', async () => {
        const res = await request(app.getHttpServer())
            .post('/enrollments/confirm')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                courseId,
                paymentId
            })
            .expect(201);

        expect(res.body.id).toBeDefined(); // Enrollment object
        expect(res.body.course_id).toBe(courseId);
    });

    it('Verify Enrollment (GET /enrollments/my)', async () => {
        const res = await request(app.getHttpServer())
            .get('/enrollments/my')
            .set('Authorization', `Bearer ${studentToken}`)
            .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].course_id).toBe(courseId);
    });

    it('Double enrollment should fail', async () => {
        await request(app.getHttpServer())
            .post(`/enrollments/checkout/${courseId}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .expect(400); // Already enrolled
    });
});
