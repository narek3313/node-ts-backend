import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';
import { Username } from 'src/auth/domain/value-objects/username.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { Session } from '../../../auth/domain/entities/session.entity';
import { SessionId } from 'src/auth/domain/value-objects/session-id.vo';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';
import { SessionCollection } from 'src/auth/domain/collections/session.collection';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

/* User properties used to create a User entity*/
export type CreateUserProps = {
    id: Uuid4;
    email: Email;
    username: Username;
    password: Password;
    avatar?: MediaURL;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    sessions?: SessionCollection;
};

/*
 * User entity used across the authentication and identity domain.
 *
 * The User represents the aggregate root of the identity system.
 * It is the central entity responsible for managing a person’s authentication data,
 * profile information, and active sessions.
 *
 * The User entity encapsulates:
 *   - unique identity (UserId)
 *   - credentials (Email, Password, Username)
 *   - optional avatar (MediaURL)
 *   - lifecycle timestamps (CreatedAt, UpdatedAt)
 *   - session lifecycle management (SessionCollection)
 *
 * Domain rules and invariants enforced:
 *   - A User is uniquely identified by their UserId and Email.
 *   - The User entity is the *only aggregate root* capable of managing Sessions.
 *   - Session creation and removal must occur through domain-safe methods
 *     (`addSession`, `removeSession`), ensuring invariants are respected.
 *   - Updates to username, email, password, or avatar always trigger an `UpdatedAt` change.
 *   - A User’s core identifiers (id, email) are immutable once created.
 *
 * Behavior provided:
 *   - `addSession(session: Session)`: Adds a new Session to the user’s active session collection.
 *   - `removeSession(sessionId: SessionId)`: Removes (revokes) a specific Session.
 *   - `getSession(sessionId: SessionId)`: Retrieves a specific Session instance by its ID.
 *   - `updateUsername`, `updateEmail`, `updatePassword`, `updateAvatar`:
 *       Safely mutate user profile fields while maintaining audit consistency.
 *   - `activeSessions`: Returns a filtered view of currently active sessions
 *       (not revoked or expired).
 *
 * Internal mechanics:
 *   - `touch()`: Updates the `UpdatedAt` timestamp whenever mutable state changes.
 *   - All updates and mutations occur through controlled domain methods — direct
 *     mutation of internal state is prohibited.
 *
 * Domain relationships:
 *   - Owns many `Session` entities through a `SessionCollection`.
 *   - Each Session references this User via a `UserId`.
 *   - The aggregate root boundary ensures sessions cannot exist without a User.
 *
 * Example lifecycle:
 *   1. A User is created via the `create()` factory, initialized with basic credentials.
 *   2. Upon login, a new Session (with a valid RefreshToken) is added to the user.
 *   3. The user may have multiple active sessions (across devices).
 *   4. Profile changes (email, username, avatar, password) are applied safely,
 *      automatically updating `UpdatedAt`.
 *   5. When a session is revoked or expired, the User aggregate reflects that
 *      through its `sessions` collection.
 */
export class User {
    private _id: Uuid4;
    private _email: Email;
    private _username: Username;
    private _password: Password;
    private _avatar?: MediaURL | null;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _sessions: SessionCollection;

    private constructor(props: CreateUserProps) {
        this._id = props.id;
        this._email = props.email;
        this._username = props.username;
        this._password = props.password;
        this._avatar = props.avatar ?? null;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
    }

    static create(props: UserProps) {
        return new User(props);
    }

    /* session managment */

    addSession(session: Session): this {
        this._sessions.add(session);

        return this;
    }

    removeSession(sessionId: SessionId): this {
        this._sessions.remove(sessionId);
        return this;
    }

    getSession(sessionId: SessionId): Session | undefined {
        return this._sessions.getById(sessionId);
    }

    /* updates */

    updateUsername(newUsername: Username) {
        this._username = newUsername;
        this.touch();
        return this;
    }

    updateEmail(newEmail: Email) {
        this._email = newEmail;
        this.touch();
        return this;
    }

    updateAvatar(newAvatar: MediaURL) {
        this._avatar = newAvatar;
        this.touch();
        return this;
    }

    updatePassword(newPassword: Password) {
        this._password = newPassword;
        this.touch();
        return this;
    }

    /* private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get id(): Uuid4 {
        return this._id;
    }
    get email(): Email {
        return this._email;
    }
    get username(): Username {
        return this._username;
    }
    get password(): Password {
        return this._password;
    }
    get avatar(): MediaURL | null {
        return this._avatar ?? null;
    }
    get createdAt(): CreatedAt {
        return this._createdAt;
    }
    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get sessions(): SessionCollection {
        return this._sessions;
    }

    /* Returns an array of active sessions*/
    get activeSessions(): Session[] {
        return this._sessions.activeSessions;
    }
}
