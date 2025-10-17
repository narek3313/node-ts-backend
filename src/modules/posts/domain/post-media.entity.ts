import { MediaType } from 'src/libs/enums/post-media-type';
import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { FileSize } from 'src/shared/domain/value-objects/file-size.vo';
import { MediaDuration } from 'src/shared/domain/value-objects/media-duration.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export type CreatePostMediaProps<T extends MediaType> = {
    id: Uuid4;
    url: MediaURL;
    type: T;
    size: FileSize;
    duration: MediaDuration | null;
};

export type PostMediaPropsPrimitives = {
    id: string;
    url: string;
    type: MediaType;
    size: number;
    duration?: number | null;
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
    private readonly _id: Uuid4;
    private readonly _url: MediaURL;
    private readonly _type: MediaType;
    private readonly _size: FileSize;
    private readonly _duration: MediaDuration | null;

    private constructor(
        id: Uuid4,
        url: MediaURL,
        type: MediaType,
        size: FileSize,
        duration: MediaDuration | null,
    ) {
        this._id = id;
        this._url = url;
        this._type = type;
        this._size = size;
        this._duration = duration;
    }

    public static createAudio(props: CreatePostMediaProps<MediaType.AUDIO>): PostMedia {
        const size = FileSize.audio(props.size.value);
        return new PostMedia(props.id, props.url, MediaType.AUDIO, size, props.duration);
    }

    public static createVideo(props: CreatePostMediaProps<MediaType.VIDEO>): PostMedia {
        const size = FileSize.video(props.size.value);
        return new PostMedia(props.id, props.url, MediaType.VIDEO, size, props.duration);
    }

    public static createImage(props: CreatePostMediaProps<MediaType.IMAGE>): PostMedia {
        const size = FileSize.image(props.size.value);
        return new PostMedia(props.id, props.url, MediaType.IMAGE, size, null);
    }

    public toJSON(): PostMediaPropsPrimitives {
        return {
            id: this._id.value,
            url: this._url.value,
            type: this._type,
            size: this._size.value,
            duration: this.duration ? this._duration!.value : undefined,
        };
    }

    /**
     * Dynamically creates a PostMedia instance from a single primitive input.
     */
    public static fromPrimitive(m: PostMediaPropsPrimitives): PostMedia {
        const id = Uuid4.create();
        const url = MediaURL.create(m.url);
        const size = FileSize.fromBytes(m.size);
        const duration = m.duration != null ? MediaDuration.fromSeconds(m.duration) : null;

        switch (m.type) {
            case MediaType.AUDIO:
                return PostMedia.createAudio({ id, url, type: MediaType.AUDIO, size, duration });
            case MediaType.VIDEO:
                return PostMedia.createVideo({ id, url, type: MediaType.VIDEO, size, duration });
            case MediaType.IMAGE:
                return PostMedia.createImage({
                    id,
                    url,
                    type: MediaType.IMAGE,
                    size,
                    duration: null,
                });
            default:
                throw new ArgumentInvalidException(`Unsupported media type: ${m.type}`);
        }
    }

    /**
     * Dynamically creates an array of PostMedia from raw DTO/primitive array
     */
    public static fromArray(mediaArray: PostMediaPropsPrimitives[]): PostMedia[] {
        return (mediaArray ?? []).map((m) => {
            const id = Uuid4.create();
            const url = MediaURL.create(m.url);
            const size = FileSize.fromBytes(m.size);
            const duration = m.duration != null ? MediaDuration.fromSeconds(m.duration) : null;

            switch (m.type) {
                case MediaType.AUDIO:
                    return PostMedia.createAudio({
                        id,
                        url,
                        type: MediaType.AUDIO,
                        size,
                        duration,
                    });
                case MediaType.VIDEO:
                    return PostMedia.createVideo({
                        id,
                        url,
                        type: MediaType.VIDEO,
                        size,
                        duration,
                    });
                case MediaType.IMAGE:
                    return PostMedia.createImage({
                        id,
                        url,
                        type: MediaType.IMAGE,
                        size,
                        duration: null,
                    });
                default:
                    throw new ArgumentInvalidException(`Unsupported media type: ${m.type}`);
            }
        });
    }

    public toString(): string {
        return `${this._type} -> ${this._url.value}`;
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

    get id(): Uuid4 {
        return this._id;
    }
}
