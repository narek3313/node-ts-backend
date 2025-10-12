import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Post } from './post.entity';
import { PostCollection } from './collections/posts.collection';
import { PostTags } from './value-objects/post-tags.vo';

/**
 * Domain-level contract for Posts repository implementations.
 *
 * Acts as a blueprint for persistence operations involving Post entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */
export interface PostsRepositoryContract {
    save(post: Post): Promise<Post>;
    delete(id: Uuid4): Promise<boolean>;
    existsById(postId: Uuid4): Promise<boolean>;
    findById(id: Uuid4): Promise<Post>;
    findByIds(ids: Uuid4[]): Promise<PostCollection>;
    findByUserIds(userIds: Uuid4[]): Promise<PostCollection>;
    findAllByUser(userId: Uuid4, offset: number, limit: number): Promise<PostCollection>;
    findAll(offset: number, limit: number): Promise<PostCollection>;
    findByTags(tags: PostTags, offset: number, limit: number): Promise<PostCollection>;
}
