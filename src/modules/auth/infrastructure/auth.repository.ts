import { PrismaService } from 'src/db/prisma/prisma.service';
import { AuthRepositoryContract } from '../domain/repository.contract';
import { Session } from 'src/modules/auth/session.entity';
import { SessionCollection } from '../domain/collections/session.collection';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { JwtToken } from '../domain/value-objects/token.vo';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../refresh-token.entity';

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

    async findSessionById(id: Uuid4): Promise<Session | null> {
        const record = await this.prisma.session.findUnique({
            where: { id: id.value },
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

    generateAccessToken(userId: Uuid4): string {
        // Minimal payload; replace/add claims per your JwtPayload contract
        const payload = { sub: userId.value };
        return this.jwtService.sign(payload, { expiresIn: '1h' });
    }

    async rotateRefreshToken(
        sessionId: Uuid4,
        role: 'user' | 'admin' | 'moderator',
    ): Promise<string> {
        const record = await this.prisma.session.findUnique({
            where: { id: sessionId.value },
        });

        if (!record) {
            throw new Error(`Session not found: ${sessionId.value}`);
        }

        const payload = { sub: record.userId, role };

        const newJwtToken = JwtToken.createFromPayload(this.jwtService, payload, '7d');

        const newRefreshToken = RefreshToken.create({
            sessionId: Uuid4.from(sessionId.value),
            token: newJwtToken,
            createdAt: CreatedAt.now(),
        });

        await this.prisma.session.update({
            where: { id: sessionId.value },
            data: {
                refreshToken: newRefreshToken.token.value,
                expiresAt: newRefreshToken.expiresAt.value.toDate
                    ? newRefreshToken.expiresAt.value.toDate()
                    : (newRefreshToken.expiresAt.value as unknown as Date),
                updatedAt: newRefreshToken.createdAt.value.toDate
                    ? newRefreshToken.createdAt.value.toDate()
                    : (newRefreshToken.createdAt.value as unknown as Date),
            },
        });

        return newRefreshToken.token.value;
    }

    async incrementFailedLoginAttempts(userId: Uuid4): Promise<number> {
        const updated = await this.prisma.userAuth.update({
            where: { userId: userId.value },
            data: {
                failedLoginAttempts: { increment: 1 },
            },
            select: { failedLoginAttempts: true },
        });

        return updated.failedLoginAttempts;
    }

    async resetFailedLoginAttempts(userId: Uuid4): Promise<void> {
        await this.prisma.userAuth.update({
            where: { userId: userId.value },
            data: {
                failedLoginAttempts: 0,
            },
        });
    }
}
