import { ValueObjectCollection } from 'src/shared/domain/value-object.collection';
import { PostMedia } from './post-media.vo';
import { MediaType } from 'src/libs/enums/post-media-type';

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
export class MediaCollection extends ValueObjectCollection<PostMedia> {
    protected equals(a: PostMedia, b: PostMedia): boolean {
        return a.equals(b);
    }

    protected clone(items: PostMedia[]): this {
        return new MediaCollection(items) as this;
    }

    static empty(): MediaCollection {
        return new MediaCollection();
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
