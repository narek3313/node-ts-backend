import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Session } from '../session.entity';
import { SessionCollection } from './collections/session.collection';
import { RefreshToken } from '../refresh-token.entity';

/**
 * Domain-level contract for authentication repository implementations.
 *
 * Combines user auth and session operations into a single cohesive interface.
 * Any concrete repository (e.g., database, in-memory, Prisma) must implement this.
 */
export interface AuthRepositoryContract {
    /**
     * Find a UserAuth by email.
     * Returns null if not found.
     */

    /**
     * Create or reuse and persist a new session.
     *
     */
    createSession(session: Session): Promise<void>;

    /**
     * Save multiple sessions at once.
     */
    saveSessions(sessions: SessionCollection): Promise<void>;

    /**
     * Revoke a session by ID.
     */
    revokeSession(id: Uuid4): Promise<void>;

    /**
     * Revoke all sessions for a user.
     * Returns the number of revoked sessions.
     */
    revokeAllSessionsForUser(id: Uuid4): Promise<number>;

    /**
     * Count active sessions for a user.
     */
    countActiveSessionsForUser(id: Uuid4): Promise<number>;

    /**
     * Find a session by its ID.
     */
    findSessionById(id: string): Promise<Session | null>;

    /**
     * Find all sessions for a user.
     */
    findAllSessionsForUser(id: Uuid4): Promise<SessionCollection>;

    /**
     * Find expired sessions across all users.
     */
    findExpiredSessions(): Promise<SessionCollection>;

    /**
     * Find inactive sessions across all users.
     */
    findInactiveSessions(): Promise<SessionCollection>;

    /**
     * Rotate the refresh token for a session.
     * Returns the new token string.
     */
    rotateRefreshToken(sessionId: string, refreshToken: RefreshToken): Promise<void>;

    /**
     * Increment failed login attempts for a user.
     */
    incrementFailedLoginAttempts(userId: Uuid4): Promise<number>;

    /**
     * Reset failed login attempts after successful login.
     */
    resetFailedLoginAttempts(userId: Uuid4): Promise<void>;
}
