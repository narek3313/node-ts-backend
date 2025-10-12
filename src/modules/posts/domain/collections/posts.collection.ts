import { EntityCollection } from 'src/shared/domain/entity.collection';
import { PostStatus } from '../value-objects/post-status.vo';
import { Post } from '../post.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class PostCollection extends EntityCollection<Post> {
    private _byAuthorId: Map<string, Post[]> = new Map();
    private _byStatus: Map<PostStatus, Post[]> = new Map();

    private constructor(posts: Post[]) {
        super(posts);

        for (const post of posts) {
            const authorKey = post.authorId.value;
            if (!this._byAuthorId.has(authorKey)) this._byAuthorId.set(authorKey, []);
            this._byAuthorId.get(authorKey)!.push(post);

            const statusKey = post.status;
            if (!this._byStatus.has(statusKey)) this._byStatus.set(statusKey, []);
            this._byStatus.get(statusKey)!.push(post);
        }
    }

    public static create(posts: Post[]): PostCollection {
        return new PostCollection(posts);
    }

    public getByAuthorId(authorId: Uuid4 | string): Post[] {
        const key = typeof authorId === 'string' ? authorId : authorId.value;
        return this._byAuthorId.get(key) ?? [];
    }

    public getByStatus(status: PostStatus): Post[] {
        return this._byStatus.get(status) ?? [];
    }
}
