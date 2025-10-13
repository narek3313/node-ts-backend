import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { UserCollection } from './collections/users.collection';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { User } from './user.entity';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';

/**
 * Domain-level contract for User repository implementations.
 *
 * Acts as a blueprint for persistence operations involving User entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface UserRepositoryContract {
    findById(id: Uuid4): Promise<User | null>;
    findAll(offset: number, limit: number): Promise<UserCollection>;
    findByEmail(email: Email): Promise<User | null>;
    existsById(id: Uuid4): Promise<IdResponse | null>;
    existsByEmail(email: Email): Promise<IdResponse | null>;
    existsByUsername(username: Username): Promise<IdResponse | null>;
    create(user: User): Promise<IdResponse>;
    updateUsername(userId: Uuid4, username: Username): Promise<void>;
    updateEmail(userId: Uuid4, email: Email): Promise<void>;
    updateAvatar(userId: Uuid4, avatar: MediaURL): Promise<void>;
    delete(userId: Uuid4): Promise<boolean>;
}
