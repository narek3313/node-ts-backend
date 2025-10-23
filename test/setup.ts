import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let app: INestApplication;

beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({}).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    globalThis.app = app;
    globalThis.prisma = prisma;
});

beforeEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.session.deleteMany({});
});

afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
});
