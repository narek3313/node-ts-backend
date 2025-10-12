import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { JwtToken } from './domain/value-objects/token.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { ExpiresAt } from 'src/shared/domain/value-objects/expires-at.vo';
import { DateTime } from 'src/libs/utils/date-time';

export type CreateAccessTokenProps = {
    id: Uuid4;
    sessionId: Uuid4;
    userId: Uuid4;
    token: JwtToken;
    createdAt?: CreatedAt;
};
/*
 * AccessToken entity used across auth domain.
 * The accessToken is issued by session and is saved in memory
 *
 *
 * This entity class enforces validation, equality semantics across auth domain
 *
 *
 * The factory methods enforces that tokens expire after 1 hour. No external functions can
 * change that parameter
 */
export class AccessToken {
    private _id: Uuid4;
    private _sessionId: Uuid4;
    private _userId: Uuid4;
    private _token: JwtToken;
    private _expiresAt: ExpiresAt;
    private _createdAt: CreatedAt;

    private constructor(props: CreateAccessTokenProps) {
        this._id = props.id;
        this._sessionId = props.sessionId;
        this._userId = props.userId;
        this._token = props.token;
        // Expires after 1 hour.
        this._expiresAt = ExpiresAt.create(DateTime.now().add({ hours: 1 }));
        this._createdAt = props.createdAt ?? CreatedAt.now();
    }

    public static create(props: CreateAccessTokenProps): AccessToken {
        return new AccessToken(props);
    }

    /* getters */

    get id(): Uuid4 {
        return this._id;
    }

    get sessionId(): Uuid4 {
        return this._sessionId;
    }

    get userId(): Uuid4 {
        return this._userId;
    }

    get token(): JwtToken {
        return this._token;
    }

    get expiresAt(): ExpiresAt {
        return this._expiresAt;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get expired(): boolean {
        return this._expiresAt.isExpired();
    }

    /**
     * Checks equality with another AccessToken.
     * Tokens are equal if their IDs are the same.
     */
    public equals(other: AccessToken): boolean {
        if (!other) return false;
        return this._id.equals(other.id);
    }
}
