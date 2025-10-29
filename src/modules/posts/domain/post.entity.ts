import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Title } from './value-objects/title.vo';
import { Content } from './value-objects/content.vo';
import { PostTags } from './value-objects/post-tags.vo';
import { PostMedia, PostMediaPropsPrimitives } from './post-media.entity';
import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';
import { MediaItem } from './value-objects/media-item.vo';
import { PostStatusEnum } from '@prisma/client';

export type CreatePostProps = {
    id: Uuid4;
    authorId: Uuid4;
    title: Title;
    content: Content;
    tags?: PostTags;
    comments?: Set<string>;
    status?: PostStatusEnum;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    deletedAt?: DateTime;
    media: PostMedia;
    likesCount?: number;
    commentsCount?: number;
    viewsCount?: number;
};

export type PostPropsPrimitives = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    tags: string[];
    comments: Set<string>;
    media: PostMediaPropsPrimitives;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
};

/**
 * Post entity representing a domain aggregate for blog posts, articles, or social content.
 *
 * Responsibilities:
 *   - Maintains a unique identity (PostId).
 *   - Holds author identity (UserId) and core content fields (Title, Content).
 *   - Manages tags (PostTags), media (MediaCollection), and post status (PostStatus).
 *   - Tracks lifecycle timestamps (CreatedAt, UpdatedAt).
 *   - Encapsulates counters for likes, comments, and views (Counter VO).
 *
 * Domain invariants:
 *   - PostId and AuthorId are immutable after creation.
 *   - Counters cannot be negative.
 *   - Deleted posts cannot be modified (content, tags, media, status).
 *   - Updates to mutable fields automatically update UpdatedAt.
 *
 * Factories:
 *   - `create(props: PostProps)`: Creates a new Post instance with optional defaults.
 *   - `zero()` (Counter): Internal usage for likes, comments, and views.
 *
 * Status management:
 *   - `publish()`: Marks the post as published (if not deleted).
 *   - `unpublish()`: Reverts the post to draft (if not deleted).
 *   - `archive()`: Archives the post (if not deleted).
 *   - `delete()`: Marks the post as deleted.
 *   - Status methods enforce domain safety and prevent operations on deleted posts.
 *
 * Content and media management:
 *   - `update(props: UpdatePostProps)`: Updates title and/or content safely.
 *   - `addMedia(media: PostMedia)`: Adds media to the post.
 *   - `removeMedia(media: PostMedia)`: Removes media from the post.
 *   - All content/media changes trigger UpdatedAt update.
 *
 * Tag management:
 *   - `addTags(tags: string[])`: Adds tags to the post.
 *   - `removeTags(tags: string[])`: Removes tags from the post.
 *   - Tag modifications respect deleted-post invariants and update UpdatedAt.
 *
 * Counters (likes, comments, views):
 *   - `addLike(amount = 1)`: Increment likes by amount.
 *   - `removeLike(amount = 1)`: Decrement likes by amount.
 *   - `addComment(amount = 1)`: Increment comments by amount.
 *   - `removeComment(amount = 1)`: Decrement comments by amount.
 *   - `addView(amount = 1)`: Increment views by amount.
 *   - Counters enforce non-negative invariants and support batch updates.
 *
 * Internal mechanics:
 *   - `touch()`: Updates UpdatedAt timestamp whenever mutable state changes.
 *   - `ensureNotDeleted(message: string)`: Throws EntityError if post is deleted.
 *
 * Domain relationships:
 *   - Owns media (PostMedia) through MediaCollection VO.
 *   - Has multiple tags through PostTags VO.
 *   - Counters (likes, comments, views) are Value Objects ensuring consistency.
 *
 * Example lifecycle:
 *   1. Post is created via `create()`, optionally with default draft status.
 *   2. Content, media, and tags are added or updated.
 *   3. Post is published, archived, or deleted through status methods.
 *   4. Users interact with the post (likes, comments, views), updating counters safely.
 *   5. All mutable changes update UpdatedAt automatically.
 */
export class Post {
    private _id: Uuid4;
    private _authorId: Uuid4;
    private _title: Title;
    private _content: Content;
    private _tags: PostTags;
    private _status: PostStatusEnum;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _media: PostMedia;
    private _likesCount: number;
    private _commentsCount: number;
    private _viewsCount: number;
    private _deletedAt?: DateTime;
    private _comments: Set<string>;

    /* Posts are always created with Draft status
     * Might be changed in the future
     */
    private constructor(props: CreatePostProps) {
        this._id = props.id;
        this._authorId = props.authorId;
        this._title = props.title;
        this._content = props.content;
        this._tags = props.tags ?? PostTags.empty();
        this._status = props.status ?? PostStatusEnum.Draft;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._deletedAt = props.deletedAt ?? undefined;
        this._media = props.media;
        this._likesCount = props.likesCount ?? 0;
        this._commentsCount = props.commentsCount ?? 0;
        this._viewsCount = props.viewsCount ?? 0;
        this._comments = props.comments ?? new Set();
    }

    public static create(props: CreatePostProps): Post {
        return new Post(props);
    }

    /* Post status */

    public publish(): void {
        this.ensureNotDeleted('Cannot publish a deleted post');
        if (this._status === PostStatusEnum.Published) {
            return;
        }

        this._status = PostStatusEnum.Published;
        this.touch();
    }

    public unpublish(): void {
        this.ensureNotDeleted('Cannot unpublish a deleted post');

        if (this._status === PostStatusEnum.Draft) {
            return;
        }

        this._status = PostStatusEnum.Draft;
        this.touch();
    }

    public archive(): void {
        this.ensureNotDeleted('Cannot archive a deleted post');

        if (this._status === PostStatusEnum.Archived) {
            return;
        }

        this._status = PostStatusEnum.Archived;
        this.touch();
    }

    public delete(): void {
        if (this._status === PostStatusEnum.Deleted) {
            return;
        }

        this._status = PostStatusEnum.Deleted;
        this.touch();
    }

    /* Content updates */

    public addMedia(media: MediaItem): void {
        this.ensureNotDeleted('Cannot add media to a deleted post');

        this._media.addItem(media);
        this.touch();
    }

    public removeMedia(mediaItemId: Uuid4): void {
        this.ensureNotDeleted('Cannot remove media from a deleted post');

        this._media.removeItem(mediaItemId);
        this.touch();
    }

    public update(title?: Title, content?: Content): void {
        this.ensureNotDeleted('Cannot update a deleted post');

        if (title) this._title = title;
        if (content) this._content = content;

        if (title || content) this.touch();
    }

    /* Tags */

    public addTags(tags: string[]): void {
        this.ensureNotDeleted('Cannot modify tags of a deleted post');

        this._tags = this._tags.add(tags);
        this.touch();
    }

    public removeTags(tags: string[]): void {
        this.ensureNotDeleted('Cannot modify tags of a deleted post');

        this._tags = this._tags.remove(tags);
        this.touch();
    }

    /* Likes, comments, views */

    public addLike(amount = 1): this {
        this._likesCount += amount;
        return this;
    }

    public removeLike(amount = 1): this {
        this._likesCount -= amount;
        return this;
    }

    public addComment(amount = 1, commentId: Uuid4): this {
        this._comments.add(commentId.value);
        this._commentsCount += amount;
        return this;
    }

    public removeComment(amount = 1, commentId: Uuid4): this {
        this._comments.delete(commentId.value);
        this._commentsCount += amount;
        return this;
    }

    public addView(amount = 1): this {
        this._viewsCount += amount;
        return this;
    }

    /* Convert every property of Post entity into primitives
     * Useful when working with interfaces that are unaware of
     * domain entities, vo's
     */
    toObject(): PostPropsPrimitives {
        return {
            id: this._id.value,
            authorId: this._authorId.value,
            title: this._title.value,
            content: this._content.value,
            status: this._status,
            media: this._media.toJSON(),
            updatedAt: this._updatedAt.value.toDate(),
            createdAt: this._createdAt.value.toDate(),
            deletedAt: this._deletedAt ? this._deletedAt.toDate() : undefined,
            tags: this._tags.toArray(),
            likesCount: this._likesCount,
            viewsCount: this._viewsCount,
            commentsCount: this._commentsCount,
            comments: this._comments,
        };
    }

    /* Private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    private ensureNotDeleted(message: string): void {
        if (this._status === PostStatusEnum.Deleted) throw new ArgumentInvalidException(message);
    }

    /* Getters */

    get id(): Uuid4 {
        return this._id;
    }

    get authorId(): Uuid4 {
        return this._authorId;
    }

    get title(): Title {
        return this._title;
    }

    get content(): Content {
        return this._content;
    }

    get tags(): PostTags {
        return this._tags;
    }

    get status(): PostStatusEnum {
        return this._status;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get deletedAt(): DateTime | undefined {
        return this._deletedAt ?? undefined;
    }

    get media(): PostMedia {
        return this._media;
    }

    get comments(): Set<string> {
        return this._comments;
    }

    get likesCount(): number {
        return this._likesCount;
    }

    get viewsCount(): number {
        return this._viewsCount;
    }

    get commentsCount(): number {
        return this._commentsCount;
    }
}
