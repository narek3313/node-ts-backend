import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { ExpiresAt } from 'src/shared/domain/value-objects/expires-at.vo';
import { JwtToken } from './token.vo';

export type CreateAccessTokenProps = {
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
    private _token: JwtToken;
    private _expiresAt: ExpiresAt;
    private _createdAt: CreatedAt;

    private constructor(props: CreateAccessTokenProps) {
        this._token = props.token;
        // Expires after 1 hour.
        this._expiresAt = props.token.expiresAt;
        this._createdAt = props.createdAt ?? CreatedAt.now();
    }

    public static create(props: CreateAccessTokenProps): AccessToken {
        return new AccessToken(props);
    }

    /* getters */

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
     */
    public equals(other: AccessToken): boolean {
        if (!other) return false;
        return this._token.equals(other.token);
    }
}
