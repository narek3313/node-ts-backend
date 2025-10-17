import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Post } from './post.entity';
import { PostCollection } from './collections/posts.collection';
import { PostTags } from './value-objects/post-tags.vo';
import { Title } from './value-objects/title.vo';
import { Content } from './value-objects/content.vo';
import { PostStatus } from './value-objects/post-status.vo';
import { MediaCollection } from './value-objects/media-collection.vo';
import { IdResponse } from 'src/libs/api/id.response.dto';

/**
 * Domain-level contract for Posts repository implementations.
 *
 * Acts as a blueprint for persistence operations involving Post entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface PostRepositoryContract {
    create(post: Post, postMediaId: Uuid4): Promise<IdResponse>;
    updateTitle(id: Uuid4, title: Title): Promise<void>;
    updateContent(id: Uuid4, content: Content): Promise<void>;
    updateStatus(id: Uuid4, status: PostStatus): Promise<void>;
    addTags(id: Uuid4, tags: PostTags): Promise<void>;
    removeTags(id: Uuid4, tags: PostTags): Promise<void>;
    addMedia(id: Uuid4, media: MediaCollection): Promise<void>;
    removeMedia(postId: Uuid4, mediaId: Uuid4): Promise<void>;
    delete(id: Uuid4): Promise<boolean>;
    existsById(postId: Uuid4): Promise<boolean>;
    findById(id: Uuid4): Promise<Post | null>;
    findAllByUser(userId: Uuid4, offset: number, limit: number): Promise<PostCollection>;
    findAll(offset: number, limit: number): Promise<PostCollection>;
    findByTags(tags: PostTags, offset: number, limit: number): Promise<PostCollection>;
}
