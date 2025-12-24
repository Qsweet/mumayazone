import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserRole } from '../src/users/dto/create-user.dto';

describe('CoursesController (e2e)', () => {
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
        email: 'instructor@example.com',
        password: 'Password123!',
        role: UserRole.INSTRUCTOR,
    };

    const studentUser = {
        name: 'Student',
        email: 'student@example.com',
        password: 'Password123!',
        // role default student
    };

    let instructorToken: string;
    let studentToken: string;

    let courseId: string;
    let moduleId: string;

    it('Create Instructor', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(instructorUser)
            .expect(201);
        instructorToken = res.body.accessToken;
    });

    it('Create Student', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send(studentUser)
            .expect(201);
        studentToken = res.body.accessToken;
    });

    it('/courses (POST) - Instructor can create course', () => {
        return request(app.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({
                title: 'NestJS Masterclass',
                slug: 'nestjs-masterclass',
                description: 'Complete guide',
                price: 4999,
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined();
                courseId = res.body.id;
            });
    });

    it('/courses (POST) - Student cannot create course', () => {
        return request(app.getHttpServer())
            .post('/courses')
            .set('Authorization', `Bearer ${studentToken}`)
            .send({
                title: 'Hacked Course',
                slug: 'hacked-course',
                description: 'Should fail',
                price: 0,
            })
            .expect(403);
    });

    it('/courses/:id/modules (POST) - Add Module', () => {
        return request(app.getHttpServer())
            .post(`/courses/${courseId}/modules`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({
                title: 'Introduction',
                order_index: 0,
            })
            .expect(201)
            .expect((res) => {
                moduleId = res.body.id;
            });
    });

    it('/courses/modules/:id/lessons (POST) - Add Lesson', () => {
        return request(app.getHttpServer())
            .post(`/courses/modules/${moduleId}/lessons`)
            .set('Authorization', `Bearer ${instructorToken}`)
            .send({
                title: 'Setup',
                content_text: ' Install Node.js',
                order_index: 0,
                video_url: 'https://example.com/video.mp4'
            })
            .expect(201);
    });

    it('/courses/:slug (GET) - Public access', () => {
        return request(app.getHttpServer())
            .get('/courses/nestjs-masterclass')
            .expect(200)
            .expect((res) => {
                expect(res.body.slug).toEqual('nestjs-masterclass');
                expect(res.body.modules).toHaveLength(1);
                expect(res.body.modules[0].lessons).toHaveLength(1);
            });
    });
});
