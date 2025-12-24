import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
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
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
    };

    let accessToken: string;
    let refreshTokenCookie: string;

    it('/auth/register (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201)
            .expect((res) => {
                expect(res.body.accessToken).toBeDefined();
                const cookies = res.headers['set-cookie'] as unknown as string[];
                expect(cookies).toBeDefined();
                expect(cookies.some((c) => c.includes('refresh_token'))).toBeTruthy();
                accessToken = res.body.accessToken;

                const cookie = cookies.find((c) => c.startsWith('refresh_token'));
                if (!cookie) throw new Error('Refresh token cookie not found');
                refreshTokenCookie = cookie;
            });
    });

    it('/auth/login (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200)
            .expect((res) => {
                expect(res.body.accessToken).toBeDefined();
                accessToken = res.body.accessToken;
                const cookies = res.headers['set-cookie'] as unknown as string[];
                const cookie = cookies.find((c) => c.startsWith('refresh_token'));
                if (!cookie) throw new Error('Refresh token cookie not found');
                refreshTokenCookie = cookie;
            });
    });

    it('/auth/refresh (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Cookie', [refreshTokenCookie])
            .expect(200)
            .expect((res) => {
                expect(res.body.accessToken).toBeDefined();
                expect(res.body.accessToken).not.toEqual(accessToken);
                accessToken = res.body.accessToken;
            });
    });

    it('/auth/logout (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
    });
});
