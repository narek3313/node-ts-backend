import { Injectable } from '@nestjs/common';
import { Post } from './domain/post.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Title } from './domain/value-objects/title.vo';
import { Content } from './domain/value-objects/content.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { PostDbRecord, PostDbRecordArray } from 'src/db/db.records';
import { PostCollection } from './domain/collections/posts.collection';
import { PostTags } from './domain/value-objects/post-tags.vo';
import { PostMedia } from './domain/post-media.entity';

@Injectable()
export class PostMapper {
    toEntity(dr: PostDbRecord): Post {
        return Post.create({
            id: Uuid4.from(dr.id),
            authorId: Uuid4.from(dr.authorId),
            title: Title.create(dr.title),
            content: Content.create(dr.content),
            status: dr.status,
            tags: PostTags.create(dr.tags),
            likesCount: dr.likesCount,
            viewsCount: dr.viewsCount,
            commentsCount: dr.commentsCount,
            createdAt: CreatedAt.from(dr.createdAt),
            updatedAt: UpdatedAt.from(dr.updatedAt),
            media: PostMedia.fromDbRecord(dr.media),
        });
    }

    toCollection(dr: PostDbRecordArray): PostCollection {
        const col = PostCollection.create();

        dr.forEach((r) => {
            col.add(
                Post.create({
                    id: Uuid4.from(r.id),
                    authorId: Uuid4.from(r.authorId),
                    title: Title.create(r.title),
                    content: Content.create(r.content),
                    status: r.status,
                    tags: PostTags.create(r.tags),
                    likesCount: r.likesCount,
                    viewsCount: r.viewsCount,
                    commentsCount: r.commentsCount,
                    createdAt: CreatedAt.from(r.createdAt),
                    updatedAt: UpdatedAt.from(r.updatedAt),
                    media: PostMedia.fromDbRecord(r.media),
                }),
            );
        });

        return col;
    }
}
