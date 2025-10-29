import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { COMMENT_REPOSITORY } from '../../comments.di-tokens';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { Err, Result, Ok } from 'oxide.ts';
import {
    FindCommentResponseDto,
    FindPaginatedCommentsResponseDto,
} from './find-comment.response.dto';
import { PostNotFoundError } from 'src/modules/posts/post.errors';

export class FindPostCommentsQuery {
    constructor(
        public readonly postId: Uuid4,
        public readonly offset: number,
        public readonly limit: number,
    ) {}
}

@QueryHandler(FindPostCommentsQuery)
export class FindPostCommentsHandler implements IQueryHandler<FindPostCommentsQuery> {
    constructor(@Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository) {}

    async execute(
        query: FindPostCommentsQuery,
    ): Promise<Result<FindPaginatedCommentsResponseDto, PostNotFoundError>> {
        const comments = await this.commentRepo.findByPost(query.postId, query.offset, query.limit);

        if (!comments) {
            return Err(new PostNotFoundError());
        }

        const dto = new FindPaginatedCommentsResponseDto({
            page: Math.floor(query.offset / query.limit) + 1,
            limit: query.limit,
            total: comments.length,
            data: comments.map(
                (c) =>
                    new FindCommentResponseDto({
                        id: c.id.value,
                        postId: c.postId.value,
                        authorId: c.authorId.value,
                        content: c.content.value,
                        createdAt: c.createdAt.value.toDate(),
                        updatedAt: c.updatedAt.value.toDate(),
                        likesCount: c.likesCount,
                        repliesCount: c.repliesCount,
                        parentId: c.parentId?.value,
                    }),
            ),
        });

        return Ok(dto);
    }
}
