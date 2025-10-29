import { CommentDbRecord } from 'src/db/db.records';
import { Comment } from './comment.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { Content } from '../posts/domain/value-objects/content.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentMapper {
    toEntity(dr: CommentDbRecord): Comment {
        return Comment.create({
            id: Uuid4.from(dr.id),
            postId: Uuid4.from(dr.postId),
            authorId: Uuid4.from(dr.authorId),
            parentId: dr.parentId ? Uuid4.from(dr.parentId) : undefined,
            likesCount: dr.likesCount,
            repliesCount: dr.repliesCount,
            createdAt: CreatedAt.from(dr.createdAt),
            updatedAt: UpdatedAt.from(dr.updatedAt),
            content: Content.create(dr.content),
        });
    }

    toArray(dr: CommentDbRecord[]): Comment[] {
        return dr.map((dr) =>
            Comment.create({
                id: Uuid4.from(dr.id),
                postId: Uuid4.from(dr.postId),
                authorId: Uuid4.from(dr.authorId),
                parentId: dr.parentId ? Uuid4.from(dr.parentId) : undefined,
                likesCount: dr.likesCount,
                repliesCount: dr.repliesCount,
                createdAt: CreatedAt.from(dr.createdAt),
                updatedAt: UpdatedAt.from(dr.updatedAt),
                content: Content.create(dr.content),
            }),
        );
    }
}
