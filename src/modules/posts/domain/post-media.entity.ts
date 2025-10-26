import { PostMediaDbRecord } from 'src/db/db.records';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { MediaItem, MediaItemPrimitives } from './value-objects/media-item.vo';

export type CreatePostMediaProps = {
    id?: Uuid4;
    postId: Uuid4;
    items: MediaItem[];
};

export type PostMediaPropsPrimitives = {
    id?: string;
    postId: string;
    items: MediaItemPrimitives[];
};

/**
 * Domain representation of a single media element (image, video, or audio)
 * attached to a Post aggregate.
 *
 * This entity encapsulates all metadata required to represent a piece
 * of media content in a consistent, validated form.
 *
 * ## Responsibilities
 * - Enforces the valid combination of properties for each media type.
 * - Provides creation factories for type-safe instantiation (`createImage`, `createVideo`, `createAudio`).
 * - Exposes value object equality semantics (`equals`, `equalsDeep`).
 * - Encapsulates domain value objects: {@link MediaURL}, {@link FileSize}, and {@link Duration}.
 *
 * ## Media Type Constraints
 * - **Image:** has `url`, `FileSize.image`, no `duration`.
 * - **Video:** has `url`, `FileSize.video`, `duration`.
 * - **Audio:** has `url`, `FileSize.audio`, `duration`.
 *
 * ## Notes
 * - Instances are mutable and can only be created through static factory methods.
 * - Equality can be checked either shallowly (`equals`) or deeply (`equalsDeep`).
 * - Designed for use within the Post aggregate and related domain collections.
 */
export class PostMedia {
    private readonly _id?: Uuid4;
    private _items: MediaItem[];
    private readonly _postId: Uuid4;

    private constructor(props: CreatePostMediaProps) {
        this._id = props.id;
        this._postId = props.postId;
        this._items = props.items;
    }

    public static fromDbRecord(dr: PostMediaDbRecord): PostMedia {
        console.log(`db record: `, dr);
        const items: MediaItem[] = dr.items.map((items) => MediaItem.fromPrimitives(items));
        const id = Uuid4.create();
        const postId = Uuid4.from(dr.postId);
        return new PostMedia({ items, id, postId });
    }

    public static create(props: CreatePostMediaProps) {
        return new PostMedia(props);
    }

    public addItem(item: MediaItem) {
        this._items.push(item);
    }

    public removeItem(id: Uuid4) {
        this._items = this.items.filter((i: MediaItem) => i.id !== id);
    }

    public toJSON(): PostMediaPropsPrimitives {
        return {
            id: this._id?.value,
            postId: this._postId.value,
            items: MediaItem.toPrimitives(this._items),
        };
    }

    get id(): Uuid4 | undefined {
        return this._id;
    }

    get postId(): Uuid4 {
        return this._postId;
    }

    get items(): MediaItem[] {
        return this._items;
    }
}
