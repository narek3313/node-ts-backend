import { MediaType } from 'src/libs/enums/post-media-type';
import { EntityCollection } from 'src/shared/domain/entity.collection';
import { PostMedia, PostMediaPropsPrimitives } from '../post-media.entity';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { MediaDuration } from 'src/shared/domain/value-objects/media-duration.vo';
import { FileSize } from 'src/shared/domain/value-objects/file-size.vo';
import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';

/**
 * Domain collection representing a set of {@link PostMedia} value objects
 * associated with a single Post aggregate.
 *
 * Inherits from {@link ValueObjectCollection} to provide immutable,
 * domain-safe handling of grouped media items (images, videos, audio, etc.).
 *
 * ## Responsibilities
 * - Encapsulates logic for managing multiple {@link PostMedia} instances.
 * - Supports equality comparison and safe cloning operations.
 * - Provides convenience methods for retrieving media by type.
 *
 * ## Methods
 * - `findImages()` → Returns all media items of type {@link MediaType.IMAGE}.
 * - `findVideos()` → Returns all media items of type {@link MediaType.VIDEO}.
 * - `findAudio()` → Returns all media items of type {@link MediaType.AUDIO}.
 *
 * ## Notes
 * - This is a domain-level collection, not a persistence construct.
 * - Immutability is preserved — modification results in a new collection instance.
 * - Used internally by the Post aggregate to organize related media.
 */
export class MediaCollection extends EntityCollection<PostMedia> {
    protected clone(items: PostMedia[]): this {
        return new MediaCollection(items) as this;
    }

    static empty(): MediaCollection {
        return new MediaCollection();
    }

    static create(items?: PostMedia[]): MediaCollection {
        if (!items || items.length === 0) {
            return MediaCollection.empty();
        }
        return new MediaCollection(items);
    }

    static createFromArray(
        mediaArray?: { type: MediaType; url: string; duration?: number; size: number }[],
    ): MediaCollection {
        const mediaCollection = MediaCollection.create(
            mediaArray?.map((m) => {
                switch (m.type) {
                    case MediaType.AUDIO:
                        return PostMedia.createAudio({
                            id: Uuid4.create(),
                            url: MediaURL.create(m.url),
                            type: m.type,
                            duration: MediaDuration.fromSeconds(m.duration!),
                            size: FileSize.fromBytes(m.size),
                        });
                    case MediaType.VIDEO:
                        return PostMedia.createVideo({
                            id: Uuid4.create(),
                            url: MediaURL.create(m.url),
                            type: m.type,
                            duration: MediaDuration.fromSeconds(m.duration!),
                            size: FileSize.fromBytes(m.size),
                        });
                    case MediaType.IMAGE:
                        return PostMedia.createImage({
                            id: Uuid4.create(),
                            url: MediaURL.create(m.url),
                            type: m.type,
                            duration: null,
                            size: FileSize.fromBytes(m.size),
                        });
                    default:
                        throw new ArgumentInvalidException(`Unsupported media type`);
                }
            }) ?? [],
        );

        return mediaCollection;
    }

    /* Returns a PostMedia array,
     * internally convert every item into MediaURL
     * and calls .value() to get the string of url*/
    toStringArray(): string[] {
        return this.toArray().map((m: PostMedia) => m.url.value);
    }

    toObjectArray(): PostMediaPropsPrimitives[] {
        return this.toArray().map((m: PostMedia) => m.toJSON());
    }

    findImages(): PostMedia[] {
        return this.toArray().filter((m) => m.type === MediaType.IMAGE);
    }

    findVideos(): PostMedia[] {
        return this.toArray().filter((m) => m.type === MediaType.VIDEO);
    }

    findAudio(): PostMedia[] {
        return this.toArray().filter((m) => m.type === MediaType.AUDIO);
    }
}
