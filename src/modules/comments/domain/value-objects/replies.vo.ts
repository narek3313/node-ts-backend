import { EntityCollection } from 'src/shared/domain/entity.collection';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Comment } from '../comment.entity';

/**
 * Domain collection representing all replies to a single Comment.
 *
 * Each Replies collection has a unique {@link ReplyId} to tie it to its parent comment.
 * Provides convenient domain-level operations for managing and querying replies.
 *
 * ## Notes
 * - Lifecycle is bound to the parent Comment aggregate.
 * - Immutability is preserved through {@link EntityCollection} base methods.
 */
export class Replies extends EntityCollection<Comment> {
    private constructor(
        /** Unique identifier for this Replies collection
         * It is created internally to avoid complexity
         */
        private readonly _id: Uuid4 = Uuid4.create(),
        replies: Comment[] = [],
    ) {
        super(replies);
    }

    static empty(): Replies {
        return new Replies();
    }

    /** Returns the unique ID of this Replies collection. */
    get id(): Uuid4 {
        return this._id;
    }

    /**
     * Finds all replies authored by a specific user.
     *
     * @param authorId - The ID of the reply author
     * @returns An array of Comment entities authored by the given user
     */
    findByAuthor(authorId: Uuid4): Comment[] {
        return this.toArray().filter((comment) => comment.authorId.equals(authorId));
    }

    /**
     * Returns the most recent replies up to the specified limit.
     *
     * @param limit - Maximum number of replies to return
     * @returns Array of recent Comment entities sorted newest first
     */
    findRecent(limit: number): Comment[] {
        return this.toArray()
            .sort((a, b) => b.createdAt.value.toMillis() - a.createdAt.value.toMillis())
            .slice(0, limit);
    }
}
