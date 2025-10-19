import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
