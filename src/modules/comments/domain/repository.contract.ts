import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { CommentCollection } from './collections/comment.collection';
import { Replies } from './value-objects/replies.vo';
import { Comment } from '../comment.entity';

/**
 * Domain-level contract for Comments repository implementations.
 *
 * Acts as a blueprint for persistence operations involving Comment entities.
 * Any concrete repository (e.g., database, in-memory, or API-backed)
 * must implement this interface and follow its defined behavior.
 */

export interface CommentsRepositoryContract {
    create(comment: Comment): Promise<Uuid4>;
    delete(id: Uuid4): Promise<boolean>;
    findById(id: Uuid4): Promise<Comment | null>;
    findByUser(userId: Uuid4, offset: number, limit: number): Promise<CommentCollection>;
    findByPost(postId: Uuid4, offset: number, limit: number): Promise<CommentCollection>;
    findReplies(parentId: Uuid4): Promise<Replies>;
    existsById(commentId: Uuid4): Promise<boolean>;
}
