import { Content } from 'src/modules/posts/domain/value-objects/content.vo';
import { Counter } from 'src/shared/domain/value-objects/counter.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Replies } from './value-objects/replies.vo';

export type CreateCommentProps = {
    postId: Uuid4;
    id: Uuid4;
    createdAt: CreatedAt;
    updatedAt: UpdatedAt;
    authorId: Uuid4;
    likesCount: Counter;
    content: Content;
    parentId?: Uuid4;
    replies: Replies;
};

/**
 * Domain entity representing a Comment within a Post.
 *
 * Encapsulates all behavior related to a comment:
 * - Likes management
 * - Content updates
 * - Reply management
 *
 * Uses value objects for IDs, timestamps, counters, and content.
 */
export class Comment {
    private _postId: Uuid4;
    private _id: Uuid4;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _authorId: Uuid4;
    private _likesCount: Counter;
    private _content: Content;
    private _parentId?: Uuid4;
    private _replies: Replies;

    private constructor(props: CreateCommentProps) {
        this._postId = props.postId;
        this._id = props.id;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._authorId = props.authorId;
        this._likesCount = props.likesCount ?? Counter.zero();
        this._content = props.content;
        this._parentId = props.parentId;
        this._replies = Replies.empty();
    }

    /**
     * Factory method to create a new Comment entity.
     */
    public static create(props: CreateCommentProps): Comment {
        return new Comment(props);
    }

    /** Increments the comment's like counter. */
    public addLike(): void {
        this._likesCount.increment();
    }

    /** Decrements the comment's like counter. */
    public removeLike(): void {
        this._likesCount.decrement();
    }

    /**
     * Updates the content of the comment and refreshes the updatedAt timestamp.
     */
    public updateContent(newContent: Content): void {
        this._content = newContent;
        this.touch();
    }

    /* replies*/

    /** Adds a reply to this comment. */
    public addReply(reply: Comment): void {
        this._replies.add(reply);
    }

    /** Removes a reply from this comment by its ID. */
    public removeReply(replyId: Uuid4): void {
        this._replies.remove(replyId);
    }

    /* private helpers*/

    /** Updates the updatedAt timestamp to the current time. */
    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get postId(): Uuid4 {
        return this._postId;
    }

    get id(): Uuid4 {
        return this._id;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get authorId(): Uuid4 {
        return this._authorId;
    }

    get likesCount(): Counter {
        return this._likesCount;
    }

    get content(): Content {
        return this._content;
    }

    get parentId(): Uuid4 | undefined {
        return this._parentId;
    }

    get replies(): Replies {
        return this._replies;
    }
}
