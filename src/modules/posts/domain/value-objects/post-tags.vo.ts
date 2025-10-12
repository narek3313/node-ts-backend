import { ArrayHelper } from "src/libs/utils/array-helper";

/**
 * Domain value object representing the tags assigned to a Post.
 *
 * Ensures uniqueness and provides immutable operations
 * for adding or removing tags.
 */
export class PostTags {
    private constructor(private readonly val: string[]) {}

    static create(tags: string[]): PostTags {
        return new PostTags(ArrayHelper.findUnique(tags));
    }

    static empty(): PostTags {
        return new PostTags([]);
    }

    public add(tags: string[]): PostTags {
        return PostTags.create(ArrayHelper.merge(this.val, tags));
    }

    public remove(tags: string[]): PostTags {
        return PostTags.create(ArrayHelper.remove(this.val, tags));
    }

    get value(): string[] {
        return this.val;
    }
}
