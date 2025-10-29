import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { UserCollection } from './collections/users.collection';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { User } from './user.entity';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { UserAuth, UserAuthWithRole } from './user-auth.entity';

/**
 * Domain-level contract for User repository implementations.
 *
 * Acts as a blueprint for persistence operations involving User entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface UserRepositoryContract {
    findAuthByEmail(email: Email): Promise<UserAuthWithRole | null>;
    findById(id: Uuid4): Promise<User | null>;
    findAll(offset: number, limit: number): Promise<UserCollection>;
    findByEmail(email: Email): Promise<User | null>;
    existsById(id: Uuid4): Promise<Uuid4 | null>;
    existsByEmail(email: Email): Promise<Uuid4 | null>;
    existsByUsername(username: Username): Promise<Uuid4 | null>;
    create(user: User, auth: UserAuth, createAdmin: boolean): Promise<Uuid4>;
    updateUsername(userId: Uuid4, username: Username): Promise<void>;
    updateEmail(userId: Uuid4, email: Email): Promise<void>;
    updateAvatar(userId: Uuid4, avatar: MediaURL): Promise<void>;
    delete(userId: Uuid4): Promise<boolean>;
}
