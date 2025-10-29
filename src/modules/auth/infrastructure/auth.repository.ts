import { PrismaService } from 'src/db/prisma/prisma.service';
import { AuthRepositoryContract } from '../domain/repository.contract';
import { Session } from 'src/modules/auth/session.entity';
import { SessionCollection } from '../domain/collections/session.collection';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../refresh-token.entity';
import { Injectable } from '@nestjs/common';
import { UserAgent } from '../domain/value-objects/user-agent.vo';
import { IpAddress } from '../domain/value-objects/ip-address.vo';
import { NotFoundException } from 'src/libs/exceptions/exceptions';

@Injectable()
export class AuthRepository implements AuthRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}
    async createSession(session: Session): Promise<void> {
        const s = session.toObject();

        await this.prisma.session.create({
            data: {
                id: s.id,
                userId: s.userId,
                refreshToken: s.refreshToken,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                revokedAt: s.revokedAt,
                ipAddress: s.ipAddress,
                userAgent: s.userAgent,
                expiresAt: s.expiresAt,
            },
        });
    }

    async saveSessions(sessions: SessionCollection): Promise<void> {
        const sessionObjects = sessions.toArray().map((s) => s.toObject());
        await this.prisma.session.createMany({
            data: sessionObjects,
            skipDuplicates: true,
        });
    }

    async revokeSession(id: Uuid4): Promise<void> {
        console.log('revoking session');
        await this.prisma.session.update({
            where: { id: id.value },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllSessionsForUser(userId: Uuid4): Promise<number> {
        const result = await this.prisma.session.updateMany({
            where: { userId: userId.value, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        return result.count;
    }

    async countActiveSessionsForUser(userId: Uuid4): Promise<number> {
        return this.prisma.session.count({
            where: {
                userId: userId.value,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
        });
    }

    async findSessionById(id: string): Promise<Session | null> {
        const record = await this.prisma.session.findUnique({
            where: { id: id },
        });
        if (!record) return null;
        return Session.createFromRecord(record);
    }

    async findAllSessionsForUser(userId: Uuid4): Promise<SessionCollection> {
        const records = await this.prisma.session.findMany({
            where: { userId: userId.value },
            orderBy: { createdAt: 'desc' },
        });
        const sessions = records.map((r) => Session.createFromRecord(r));
        return SessionCollection.create(sessions);
    }

    async findExistingSession(
        userAgent: UserAgent,
        ipAddress: IpAddress,
        userId: Uuid4,
    ): Promise<Session | null> {
        const session = await this.prisma.session.findFirst({
            where: {
                userId: userId.value,
                ipAddress: ipAddress.value,
                userAgent: userAgent.value,
                revokedAt: null,
            },
        });

        if (!session) {
            return null;
        }

        return Session.createFromRecord(session);
    }

    async findExpiredSessions(): Promise<SessionCollection> {
        const records = await this.prisma.session.findMany({
            where: { expiresAt: { lt: new Date() } },
        });
        const sessions = records.map((r) => Session.createFromRecord(r));
        return SessionCollection.create(sessions);
    }

    async findInactiveSessions(): Promise<SessionCollection> {
        const records = await this.prisma.session.findMany({
            where: { revokedAt: { not: null } },
        });
        const sessions = records.map((r) => Session.createFromRecord(r));
        return SessionCollection.create(sessions);
    }

    async rotateRefreshToken(sessionId: string, refreshToken: RefreshToken): Promise<void> {
        const record = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!record) {
            throw new NotFoundException();
        }

        await this.prisma.session.update({
            where: { id: sessionId },
            data: {
                refreshToken: refreshToken.token.value,
                expiresAt: refreshToken.expiresAt.value.toDate
                    ? refreshToken.expiresAt.value.toDate()
                    : (refreshToken.expiresAt.value as unknown as Date),
                updatedAt: refreshToken.createdAt.value.toDate
                    ? refreshToken.createdAt.value.toDate()
                    : (refreshToken.createdAt.value as unknown as Date),
            },
        });
    }
}
