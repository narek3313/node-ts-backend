import { Injectable } from '@nestjs/common';
import { Post } from './domain/post.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Title } from './domain/value-objects/title.vo';
import { Content } from './domain/value-objects/content.vo';
import { PostStatus } from './domain/value-objects/post-status.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { MediaCollection } from './domain/value-objects/media-collection.vo';
import { postDbRecord, postDbRecordArray } from 'src/db/db.records';
import { PostCollection } from './domain/collections/posts.collection';
import { PostTags } from './domain/value-objects/post-tags.vo';
import { Counter } from 'src/shared/domain/value-objects/counter.vo';
import { MediaType } from 'src/libs/enums/post-media-type';

@Injectable()
export class PostMapper {
    toEntity(dr: postDbRecord): Post {
        return Post.create({
            id: Uuid4.from(dr.id),
            authorId: Uuid4.from(dr.authorId),
            title: Title.create(dr.title),
            content: Content.create(dr.content),
            status: PostStatus.fromString(dr.status),
            tags: PostTags.create(dr.tags),
            likesCount: Counter.from(dr.likesCount),
            viewsCount: Counter.from(dr.viewsCount),
            commentsCount: Counter.from(dr.commentsCount),
            media: MediaCollection.createFromArray(
                (dr.media as { type: MediaType; url: string; duration?: number; size: number }[]) ??
                    [],
            ),
            createdAt: CreatedAt.from(dr.createdAt),
            updatedAt: UpdatedAt.from(dr.updatedAt),
        });
    }

    toCollection(dr: postDbRecordArray): PostCollection {
        const col = PostCollection.create();

        dr.forEach((r) => {
            col.add(
                Post.create({
                    id: Uuid4.from(r.id),
                    authorId: Uuid4.from(r.authorId),
                    title: Title.create(r.title),
                    content: Content.create(r.content),
                    status: PostStatus.fromString(r.status),
                    tags: PostTags.create(r.tags),
                    likesCount: Counter.from(r.likesCount),
                    viewsCount: Counter.from(r.viewsCount),
                    commentsCount: Counter.from(r.commentsCount),
                    media: MediaCollection.createFromArray(
                        (r.media as {
                            type: MediaType;
                            url: string;
                            duration?: number;
                            size: number;
                        }[]) ?? [],
                    ),
                    createdAt: CreatedAt.from(r.createdAt),
                    updatedAt: UpdatedAt.from(r.updatedAt),
                }),
            );
        });

        return col;
    }
}
