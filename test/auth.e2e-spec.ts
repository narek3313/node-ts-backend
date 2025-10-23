import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

declare const app: INestApplication;
declare const prisma: PrismaClient;

describe('Auth E2E', () => {
    it('should login the user', async () => {
        await prisma.user.create({
            data: {
                id: 'user-id',
                email: 'testik@test.com',
                username: 'bobik',
                auth: { create: { password: 'StrongPassword123!' } },
            },
        });

        const res = await request(app.getHttpServer()).post('api/v1/auth/login').send({
            email: 'testik@test.com',
            password: 'StrongPassword123!',
        });

        expect(res.status).toBe(201);
        expect(res.body).property('accessToken');
    });
});
