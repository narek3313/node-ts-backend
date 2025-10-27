import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl =
    process.env.DB_TARGET === 'remote'
        ? process.env.DATABASE_URL_REMOTE
        : process.env.DATABASE_URL_LOCAL;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({ datasources: { db: { url: dbUrl } } });
    }
    onModuleInit() {
        setImmediate(() => {
            this.$connect()
                .then(() => console.log('Prisma connected'))
                .catch((e) => console.warn('Prisma failed to connect (ignored in dev)', e));
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
