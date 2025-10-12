import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { UserCollection } from './collections/users.collection';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { User } from './user.entity';

/**
 * Domain-level contract for User repository implementations.
 *
 * Acts as a blueprint for persistence operations involving User entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface UserRepositoryContract {
    findByIds(ids: Uuid4[]): Promise<UserCollection>;
    findByEmails(emails: Email[]): Promise<UserCollection>;
    findById(id: Uuid4): Promise<User | null>;
    findAll(offset: number, limit: number): Promise<UserCollection>;
    findByEmail(email: Email): Promise<User | null>;
    existsById(id: Uuid4): Promise<boolean>;
    existsByEmail(email: Email): Promise<boolean>;
    existsByUsername(username: string): Promise<boolean>;
    save(user: User): Promise<User>;
    delete(userId: Uuid4): Promise<boolean>;
}
