import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { RefreshToken } from './refresh-token.entity';
import { IpAddress } from './domain/value-objects/ip-address.vo';
import { UserAgent } from './domain/value-objects/user-agent.vo';
import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { RevokedAt } from 'src/shared/domain/value-objects/revoked-at.vo';
import { ExpiresAt } from 'src/shared/domain/value-objects/expires-at.vo';
import { JwtToken } from './domain/value-objects/token.vo';

export type CreateSessionProps = {
    id?: Uuid4;
    userId: Uuid4;
    refreshToken: RefreshToken;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    revokedAt?: RevokedAt;
    ipAddress: IpAddress;
    userAgent: UserAgent;
};

export type SessionPrimitives = {
    id: string;
    userId: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    revokedAt: Date | null;
    ipAddress: string;
    userAgent: string;
    expiresAt: Date;
};

/*
 * Session entity used across the authentication domain.
 *
 * Each Session represents a single authenticated device or client instance
 * belonging to a specific User. A Session is uniquely identified by its SessionId
 * and is always associated with exactly one UserId.
 *
 * The Session encapsulates:
 *   - a RefreshToken (used for issuing new access tokens)
 *   - device context (UserAgent and IpAddress)
 *   - lifecycle timestamps (CreatedAt, UpdatedAt, RevokedAt)
 *
 * The Session entity is the authoritative source of truth for whether
 * a client session is active, revoked, or expired.
 *
 * Business rules enforced:
 *   - A session cannot be created with an inactive refresh token.
 *   - Each session may have exactly one refresh token at a time.
 *   - Revoking a session revokes its associated refresh token.
 *   - A revoked session cannot rotate its refresh token.
 *   - The refresh token defines the session’s expiration (7 days by default).
 *
 * The Session entity also provides methods for:
 *   - revoking the session (`revoke`)
 *   - rotating its refresh token (`rotateRefreshToken`)
 *   - maintaining update timestamps via an internal touch mechanism
 *
 * This entity guarantees immutability of core identifiers and ensures
 * that all state transitions (revocation, rotation) are consistent with
 * domain invariants.
 *
 * Example lifecycle:
 *   1. A new session is created upon login with a valid RefreshToken.
 *   2. The session remains active until either revoked or expired.
 *   3. On refresh, the refresh token may be rotated — old one revoked,
 *      new one persisted.
 *   4. The session may be revoked manually or automatically (e.g., logout).
 */
export class Session {
    private _id: Uuid4;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _refreshToken: RefreshToken;
    private _userAgent: UserAgent;
    private _ipAddress: IpAddress;
    private _revokedAt: RevokedAt;
    private _userId: Uuid4;

    private constructor(props: CreateSessionProps) {
        this._id = props.id ?? Uuid4.create();
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._refreshToken = props.refreshToken;
        this._userAgent = props.userAgent;
        this._ipAddress = props.ipAddress;
        this._revokedAt = props.revokedAt ?? RevokedAt.none();
        this._userId = props.userId;
    }

    public static create(props: CreateSessionProps) {
        if (!props.refreshToken.active) {
            throw new ArgumentInvalidException('Cannot create session with inactive refresh token');
        }
        return new Session(props);
    }

    public static createFromRecord(record: SessionPrimitives): Session {
        const refreshToken = RefreshToken.create({
            sessionId: Uuid4.from(record.id),
            token: JwtToken.create(record.refreshToken),
            createdAt: CreatedAt.from(record.createdAt),
            revokedAt: record.revokedAt ? RevokedAt.at(record.revokedAt) : RevokedAt.none(),
        });

        refreshToken.restoreExpiresAt(record.expiresAt);

        return Session.create({
            id: Uuid4.from(record.id),
            userId: Uuid4.from(record.userId),
            refreshToken,
            createdAt: CreatedAt.from(record.createdAt),
            updatedAt: UpdatedAt.from(record.updatedAt),
            revokedAt: record.revokedAt ? RevokedAt.at(record.revokedAt) : RevokedAt.none(),
            ipAddress: IpAddress.create(record.ipAddress),
            userAgent: UserAgent.create(record.userAgent),
        });
    }

    revoke(): void {
        this._refreshToken.revoke();
        this._revokedAt = RevokedAt.now();
        this.touch();
    }

    rotateRefreshToken(newToken: RefreshToken): void {
        if (this.revoked) {
            throw new ArgumentInvalidException('Cannot rotate a revoked session');
        }

        this._refreshToken.revoke();
        this._refreshToken = newToken;

        this.touch();
    }

    toObject(): SessionPrimitives {
        return {
            id: this._id.value,
            userId: this._userId.value,
            refreshToken: this._refreshToken.token.value,
            createdAt: this._createdAt.value.toDate(),
            updatedAt: this._updatedAt.value.toDate(),
            revokedAt: this._revokedAt.valueOrNull?.toDate() ?? null,
            ipAddress: this._ipAddress.value,
            userAgent: this._userAgent.value,
            expiresAt: this._refreshToken.expiresAt.value.toDate(),
        };
    }

    /* private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get id(): Uuid4 {
        return this._id;
    }
    get createdAt(): CreatedAt {
        return this._createdAt;
    }
    get expiresAt(): ExpiresAt {
        return this.refreshToken.expiresAt;
    }
    get refreshToken(): RefreshToken {
        return this._refreshToken;
    }
    get userAgent(): UserAgent {
        return this._userAgent;
    }
    get ipAddress(): IpAddress {
        return this._ipAddress;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get userId(): Uuid4 {
        return this._userId;
    }

    get active(): boolean {
        return !this.revoked && this._refreshToken.active;
    }

    get revoked(): boolean {
        return this._revokedAt.isRevoked();
    }

    get expired(): boolean {
        return this.expiresAt.isExpired();
    }

    get revokedAt(): RevokedAt {
        return this._revokedAt;
    }
}
