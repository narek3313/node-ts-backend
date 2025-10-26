import { MediaType } from 'src/libs/enums/post-media-type';
import { FileSize } from 'src/shared/domain/value-objects/file-size.vo';
import { MediaDuration } from 'src/shared/domain/value-objects/media-duration.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export type MediaItemProps = {
    id: Uuid4;
    url: MediaURL;
    size: FileSize;
    type: MediaType;
    duration?: MediaDuration;
};

export type MediaItemPrimitives = {
    id: string;
    url: string;
    size: number;
    type: MediaType;
    duration?: number;
};

export class MediaItem {
    private readonly _id: Uuid4;
    private readonly _url: MediaURL;
    private readonly _type: MediaType;
    private readonly _size: FileSize;
    private readonly _duration?: MediaDuration;

    private constructor(props: MediaItemProps) {
        this._id = props.id;
        this._url = props.url;
        this._type = props.type;
        this._size = props.size;
        this._duration = props.duration;
    }

    public static create(props: MediaItemProps) {
        return new MediaItem(props);
    }

    public static fromPrimitives(props: MediaItemPrimitives): MediaItem {
        const id = Uuid4.create();
        const url = MediaURL.create(props.url);
        const size = FileSize.fromBytes(props.size);
        const duration = props.duration ? MediaDuration.fromSeconds(props.duration) : undefined;

        return new MediaItem({ id, url, size, type: props.type, duration });
    }

    public static createArray(items: MediaItemPrimitives[]) {
        const result: MediaItem[] = [];

        for (let i = 0; i < items.length; i++) {
            result.push(MediaItem.fromPrimitives(items[i]));
        }

        return result;
    }

    /* helper function to convert media items to primitives */
    public static toPrimitives(items: MediaItem[]): MediaItemPrimitives[] {
        return items.map((i) => ({
            id: i.id.value,
            url: i.url.value,
            size: i.size.value,
            type: i.type,
            duration: i.duration ? i.duration.value : undefined,
        }));
    }

    public toJSON() {
        return {
            id: this._id.value,
            size: this._size.value,
            type: this._type,
            duration: this._duration?.value ?? undefined,
            url: this._url.value,
        };
    }

    get id(): Uuid4 {
        return this._id;
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

    get duration(): MediaDuration | undefined {
        return this._duration;
    }
}
