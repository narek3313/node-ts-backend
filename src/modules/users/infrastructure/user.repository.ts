import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserRepositoryContract } from '../domain/repository.contract';
import { User } from 'src/modules/users/domain/user.entity';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Prisma } from '@prisma/client';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserRepository implements UserRepositoryContract {
    constructor(private readonly prisma: PrismaService) {}

    async findById(userId: Uuid4): Promise<User | null> {
        const id = userId.value;

        const user = await this.prisma.user.findFirst({
            where: { id },
            include: { sessions: true },
        });

        if (!user) {
            return null;
        }

        return UserMapper.createUserEntityFromDbRecord(user);
    }
    findAll(offset: number, limit: number): Promise<UserCollection> {}
    async findByEmail(_email: Email): Promise<User | null> {
        const email = _email.value;

        const user = await this.prisma.user.findFirst({
            where: { email },
            include: { sessions: true },
        });

        if (!user) {
            return null;
        }

        return UserMapper.createUserEntityFromDbRecord(user);
    }
    async existsById(userId: Uuid4): Promise<IdResponse | null> {
        const id = userId.value;

        const user = await this.prisma.user.findFirst({
            where: { id },
            select: { id: true },
        });

        if (!user) {
            return null;
        }

        return new IdResponse(userId);
    }

    async existsByEmail(_email: Email): Promise<IdResponse | null> {
        const email = _email.value;

        const user = await this.prisma.user.findFirst({
            where: { email },
            select: { id: true },
        });

        if (!user) {
            return null;
        }

        return new IdResponse(Uuid4.from(user.id));
    }

    async existsByUsername(_username: Username): Promise<IdResponse | null> {
        const username = _username.value;

        const user = await this.prisma.user.findFirst({
            where: { username },
            select: { id: true },
        });

        if (!user) {
            return null;
        }

        return new IdResponse(Uuid4.from(user.id));
    }

    async create(user: User): Promise<IdResponse> {
        const data = user.toObject();

        await this.prisma.user.create({ data });

        return new IdResponse(user.id);
    }

    async updateAvatar(userId: Uuid4, avatar: MediaURL): Promise<void> {
        const id = userId.value;
        await this.prisma.user.update({
            where: { id },
            data: {
                avatar: avatar.value,
            },
        });
    }

    async updateEmail(userId: Uuid4, email: Email): Promise<void> {
        const id = userId.value;
        await this.prisma.user.update({
            where: { id },
            data: {
                email: email.value,
            },
        });
    }

    async updateUsername(userId: Uuid4, username: Username): Promise<void> {
        const id = userId.value;
        await this.prisma.user.update({
            where: { id },
            data: {
                username: username.value,
            },
        });
    }

    async delete(userId: Uuid4): Promise<boolean> {
        const id = userId.value;

        try {
            await this.prisma.user.delete({ where: { id } });
            return true;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                return false;
            }
            throw err;
        }
    }
}
