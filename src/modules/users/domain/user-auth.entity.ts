import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export type CreateUserAuthProps = {
    userId: Uuid4;
    password: Password;
    lastPasswordChange?: UpdatedAt;
    failedLoginAttempts?: number;
};

export type UserAuthPrimitives = {
    userId: string;
    password: string;
    lastPasswordChange?: Date;
    failedLoginAttempts?: number;
};

/**
 * UserAuth aggregate.
 *
 * Represents the authentication credentials and security state for a User.
 *
 * Responsibilities:
 *  - Stores the hashed password for a User.
 *  - Tracks the last time the password was changed.
 *  - Tracks failed login attempts for brute-force protection.
 *
 * Invariants & Domain Rules:
 *  - Password updates must reset failed login attempts and update `lastPasswordChange`.
 *  - Failed login attempts can be incremented individually.
 *  - The aggregate is tied to a single User via `userId`.
 *
 * Behavior:
 *  - `updatePassword(newPassword: string)` updates the password securely and resets related state.
 *  - `incrementFailedLogin()` increases the failed login counter.
 *  - `resetFailedLogins()` resets the failed login counter.
 *
 * Relationships:
 *  - One-to-one relationship with the `User` aggregate (via `userId`).
 */
export class UserAuth {
    private _userId: Uuid4;
    private _password: Password;
    private _lastPasswordChange?: UpdatedAt;
    private _failedLoginAttempts: number;

    private constructor(props: CreateUserAuthProps) {
        this._userId = props.userId;
        this._password = props.password;
        this._lastPasswordChange = props.lastPasswordChange;
        this._failedLoginAttempts = props.failedLoginAttempts ?? 0;
    }

    static create(props: CreateUserAuthProps): UserAuth {
        return new UserAuth(props);
    }
    updatePassword(newPassword: Password): this {
        this._password = newPassword;
        this._lastPasswordChange = UpdatedAt.now();
        this._failedLoginAttempts = 0;
        return this;
    }

    incrementFailedLogin(): this {
        this._failedLoginAttempts += 1;
        return this;
    }

    resetFailedLogins(): this {
        this._failedLoginAttempts = 0;
        return this;
    }

    toObject(): UserAuthPrimitives {
        return {
            userId: this._userId.value,
            password: this._password.value,
            lastPasswordChange: this._lastPasswordChange?.value.toDate(),
            failedLoginAttempts: this._failedLoginAttempts,
        };
    }

    /* getters */

    get userId(): Uuid4 {
        return this._userId;
    }

    get password(): Password {
        return this._password;
    }

    get lastPasswordChange(): UpdatedAt | undefined {
        return this._lastPasswordChange;
    }

    get failedLoginAttempts(): number {
        return this._failedLoginAttempts;
    }
}
