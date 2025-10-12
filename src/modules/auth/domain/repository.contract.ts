import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Session } from '../session.entity';
import { SessionCollection } from './collections/session.collection';

/**
 * Domain-level contract for Auth repository implementations.
 *
 * Acts as a blueprint for persistence operations involving Auth-related entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface AuthRepositoryContract {
    saveSession(session: Session): Promise<void>;
    saveSessions(sessions: SessionCollection): Promise<void>;
    revokeSession(id: Uuid4): Promise<void>;
    revokeAllSessionsForUser(id: Uuid4): Promise<number>;
    countActiveSessionsForUser(id: Uuid4): Promise<number>;
    findSessionByToken(id: Uuid4): Promise<Session | null>;
    findSessionById(id: Uuid4): Promise<Session | null>;
    findAllSessionsForUser(id: Uuid4): Promise<SessionCollection>;
    findExpiredSessions(): Promise<SessionCollection>;
    findInactiveSessions(): Promise<SessionCollection>;
}
