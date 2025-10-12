import { MediaType } from 'src/libs/enums/post-media-type';
import { FileSize } from 'src/shared/domain/value-objects/file-size.vo';
import { MediaDuration } from 'src/shared/domain/value-objects/media-duration.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';

export type CreatePostMediaProps<T extends MediaType> = {
    url: MediaURL;
    type: T;
    size: FileSize;
    duration: MediaDuration | null;
};

/**
 * Domain representation of a single media element (image, video, or audio)
 * attached to a Post aggregate.
 *
 * This value object encapsulates all metadata required to represent a piece
 * of media content in a consistent, validated, and immutable form.
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
 * - Instances are immutable and can only be created through static factory methods.
 * - Equality can be checked either shallowly (`equals`) or deeply (`equalsDeep`).
 * - Designed for use within the Post aggregate and related domain collections.
 */
export class PostMedia {
    private readonly _url: MediaURL;
    private readonly _type: MediaType;
    private readonly _size: FileSize;
    private readonly _duration: MediaDuration | null;

    private constructor(
        url: MediaURL,
        type: MediaType,
        size: FileSize,
        duration: MediaDuration | null,
    ) {
        this._url = url;
        this._type = type;
        this._size = size;
        this._duration = duration;
    }

    public static createAudio(props: CreatePostMediaProps<MediaType.AUDIO>): PostMedia {
        const size = FileSize.audio(props.size.value);
        return new PostMedia(props.url, MediaType.AUDIO, size, props.duration);
    }

    public static createVideo(props: CreatePostMediaProps<MediaType.VIDEO>): PostMedia {
        const size = FileSize.video(props.size.value);
        return new PostMedia(props.url, MediaType.VIDEO, size, props.duration);
    }

    public static createImage(props: CreatePostMediaProps<MediaType.IMAGE>): PostMedia {
        const size = FileSize.image(props.size.value);
        return new PostMedia(props.url, MediaType.IMAGE, size, null);
    }

    /* Check uniqueness only based on URL */
    public equals(other: PostMedia): boolean {
        return this.url === other.url;
    }

    /* Check uniqueness based on every metadata */
    public equalsDeep(other: PostMedia): boolean {
        return (
            this._url.equals(other.url) &&
            this._type === other.type &&
            this._size.equals(other.size) &&
            ((this._duration && other.duration && this._duration.equals(other.duration)) ||
                this._duration === other.duration)
        );
    }

    public toJSON() {
        return {
            url: this._url.toString(),
            type: this._type,
            size: this._size.toJSON(),
            duration: this._duration?.toJSON() ?? null,
        };
    }

    public toString(): string {
        return `${this._type} -> ${this._url.toString()}`;
    }

    get url(): MediaURL {
        return this._url;
    }

    get type(): MediaType {
        return this._type;
    }

    get size(): FileSize {
        return this._size;
    }

    get duration(): MediaDuration | null {
        return this._duration;
    }
}
