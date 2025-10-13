import { EntityCollection } from 'src/shared/domain/entity.collection';
import { Session } from '../../session.entity';
import {
    ArgumentNotProvidedException,
    ArgumentOutOfRangeException,
} from 'src/libs/exceptions/exceptions';
import { IpAddress } from '../value-objects/ip-address.vo';
import { UserAgent } from '../value-objects/user-agent.vo';

/**
 * Domain collection representing a bounded set of {@link Session} entities.
 *
 * Used when working with multiple Session instances belonging to the same aggregate root.
 * This collection provides convenient domain-level operations such as add, remove, and getById.
 *
 * Inherits from the {@link EntityCollection} base class.
 *
 * ## Performance
 * - `add`, `remove`, and `getById` — O(1)
 * - Other operations — O(n)
 *   (This is acceptable since the collection is intentionally small.)
 *
 * ## Constraints
 * - Maximum of 5 items are allowed at any time.
 *   This boundary is enforced by domain rules to prevent excessive session buildup.
 *
 * ## Notes
 * - Designed for use within the domain layer — not a persistence structure.
 * - Imposes logical limits to maintain aggregate consistency.
 */
export class SessionCollection extends EntityCollection<Session> {
    private readonly maxItems = 5;

    /* This function overrides the original add() method of base class to
     * enforce limits on SessionCollection class
     */
    add(session: Session) {
        if (this.items.size >= this.maxItems) {
            throw new ArgumentNotProvidedException(
                'SessionCollection can not have more than 5 sessions',
            );
        }

        super.add(session);
    }

    /* Instantiate an empty SessionCollection */
    static empty(): SessionCollection {
        return new SessionCollection();
    }

    public static create(sessions: Session[]): SessionCollection {
        if (sessions.length > 5) {
            throw new ArgumentOutOfRangeException(
                'SessionCollection can not have more than 5 sessions',
            );
        }
        return new SessionCollection(sessions);
    }

    revokeExpired(): number {
        let count = 0;
        for (const session of this.getAll()) {
            if (!session.revoked && session.expired) {
                session.revoke();
                count++;
            }
        }
        return count;
    }

    revokeInactive(): number {
        let count = 0;
        for (const session of this.getAll()) {
            if (!session.revoked && !session.active) {
                session.revoke();
                count++;
            }
        }
        return count;
    }

    sortByRecent(): Session[] {
        return this.getAll().sort(
            (a, b) => b.createdAt.time.toMillis() - a.createdAt.time.toMillis(),
        );
    }

    /* getters */

    /* Returns most recently created session */
    get mostRecent(): Session | null {
        return this.sortByRecent()[0] ?? null;
    }

    /* Returns only the active sessions for a user */
    get activeSessions(): Session[] {
        return this.getAll().filter((s) => s.revoked === false);
    }

    /* Returns number of active sessions of a user */
    get activeCount(): number {
        return this.activeSessions.length;
    }

    getByIP(ip: IpAddress): Session[] {
        return this.getAll().filter((s) => s.ipAddress === ip);
    }

    getByUserAgent(ua: UserAgent): Session[] {
        return this.getAll().filter((s) => s.userAgent === ua);
    }
}
