import { PostStatusEnum } from 'src/libs/enums/post-status';

/**
 * Domain value object representing the status of a Post.
 *
 * Provides type-safe creation and semantic checks for allowed post states.
 */
export class PostStatus {
    private constructor(private readonly _value: PostStatusEnum) {}

    /** Returns the raw enum value of the post status. */
    get value(): PostStatusEnum {
        return this._value;
    }

    /** Factory for draft status. */
    static draft(): PostStatus {
        return new PostStatus(PostStatusEnum.Draft);
    }

    /** Factory for published status. */
    static published(): PostStatus {
        return new PostStatus(PostStatusEnum.Published);
    }

    /** Factory for archived status. */
    static archived(): PostStatus {
        return new PostStatus(PostStatusEnum.Archived);
    }

    /** Factory that creates a PostStatus from a string (DB value) */
    static fromString(status: string): PostStatus {
        switch (status.toUpperCase()) {
            case 'DRAFT':
                return PostStatus.draft();
            case 'PUBLISHED':
                return PostStatus.published();
            case 'ARCHIVED':
                return PostStatus.archived();
            case 'DELETED':
                return PostStatus.deleted();
            default:
                throw new Error(`Invalid post status: ${status}`);
        }
    }

    /** Factory for deleted status. */
    static deleted(): PostStatus {
        return new PostStatus(PostStatusEnum.Deleted);
    }

    /** Returns true if the post is marked as deleted. */
    isDeleted(): boolean {
        return this._value === PostStatusEnum.Deleted;
    }

    /** Returns true if the post is in draft state. */
    isDraft(): boolean {
        return this._value === PostStatusEnum.Draft;
    }

    /** Returns true if the post is published. */
    isPublished(): boolean {
        return this._value === PostStatusEnum.Published;
    }

    /** Returns true if the post is archived. */
    isArchived(): boolean {
        return this._value === PostStatusEnum.Archived;
    }
}
