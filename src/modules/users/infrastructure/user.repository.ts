import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserRepositoryContract } from '../domain/repository.contract';
import { User } from 'src/modules/users/domain/user.entity';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { UserMapper } from '../user.mapper';
import { UserCollection } from '../domain/collections/users.collection';
import { UserAuth } from '../domain/user-auth.entity';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';

@Injectable()
export class UserRepository implements UserRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: UserMapper,
    ) {}

    async findById(userId: Uuid4): Promise<User | null> {
        const id = userId.value;

        const user = await this.prisma.user.findFirst({
            where: { id },
            include: { sessions: true },
        });

        if (!user) {
            return null;
        }

        return this.mapper.toEntity(user);
    }

    async findAll(offset: number, limit: number): Promise<UserCollection> {
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { sessions: true },
            }),
            this.prisma.user.count(),
        ]);

        const userCollection = this.mapper.toCollection(users);

        const page = Math.floor(offset / limit) + 1;
        userCollection.setPagination(page, limit, total);

        return userCollection;
    }

    async findByEmail(_email: Email): Promise<User | null> {
        const email = _email.value;

        const user = await this.prisma.user.findFirst({
            where: { email },
            include: { sessions: true },
        });

        if (!user) {
            return null;
        }

        return this.mapper.toEntity(user);
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

    async getPassword(_id: Uuid4): Promise<Password | null> {
        const id = _id.value;

        const user = await this.prisma.userAuth.findFirst({
            where: { userId: id },
            select: { password: true },
        });

        if (!user) {
            return null;
        }

        return Password.create(user.password);
    }

    async create(user: User, _auth: UserAuth): Promise<IdResponse> {
        const data = user.toObject();
        const auth = _auth.toObject();

        await this.prisma.user.create({ data: { ...data, auth: { create: { ...auth } } } });

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

    async updatePassword(_userId: Uuid4, _password: Password): Promise<void> {
        const userId = _userId.value;
        const password = _password.value;
        await this.prisma.userAuth.update({
            where: { userId },
            data: {
                password,
                lastPasswordChange: new Date(),
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
            return false;
        }
    }
}
