import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepository } from '../../infrastructure/post.repository';
import { Inject } from '@nestjs/common';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, Err, Ok } from 'oxide.ts';
import { POST_REPOSITORY } from '../../post.di-tokens';
import {
    FindPaginatedPostResponseDto,
    FindPostResponseDto,
    MediaItemResponseDto,
} from './find-post.response.dto';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Post } from 'src/modules/posts/domain/post.entity';
import { FindCommentResponseDto } from 'src/modules/comments/queries/find-comments/find-comment.response.dto';
import { COMMENT_REPOSITORY } from 'src/modules/comments/comments.di-tokens';
import { CommentRepository } from 'src/modules/comments/infrastructure/comment.repository';

export class GetPostByIdQuery {
    constructor(public readonly id: Uuid4) {}
}

export class GetPostsByUserQuery {
    constructor(
        public readonly authorId: Uuid4,
        public readonly offset: number,
        public readonly limit: number,
    ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdHandler implements IQueryHandler<GetPostByIdQuery> {
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(
        query: GetPostByIdQuery,
    ): Promise<Result<FindPostResponseDto, NotFoundException>> {
        const post = await this.postRepo.findById(query.id);

        if (!post) {
            return Err(new NotFoundException('Post not found'));
        }

        const dto = new FindPostResponseDto({
            id: post.id.value,
            title: post.title.value,
            content: post.content.value,
            authorId: post.authorId.value,
            updatedAt: post.updatedAt.value.toDate(),
            createdAt: post.createdAt.value.toDate(),
            media: post.media
                ? post.media.toJSON().items.map(
                      (m) =>
                          new MediaItemResponseDto({
                              url: m.url,
                              type: m.type,
                              size: m.size,
                              duration: m.duration ?? undefined,
                          }),
                  )
                : [],
        });

        return Ok(dto);
    }
}

@QueryHandler(GetPostsByUserQuery)
export class GetPostsByUserHandler implements IQueryHandler<GetPostsByUserQuery> {
    constructor(
        @Inject(POST_REPOSITORY) private readonly postRepo: PostRepository,
        @Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository,
    ) {}

    async execute(
        query: GetPostsByUserQuery,
    ): Promise<Result<FindPaginatedPostResponseDto, NotFoundException>> {
        const { authorId, offset, limit } = query;
        const [posts, total] = await this.postRepo.findAllByUser(authorId, offset, limit);

        if (!posts.length) {
            return Err(new NotFoundException('No posts found'));
        }

        // collect all comment IDs from all posts
        const allCommentIds = posts.flatMap((post) => Array.from(post.comments || []));
        const commentEntities = allCommentIds.length
            ? await this.commentRepo.findByIds(allCommentIds.map((id) => Uuid4.from(id)))
            : [];

        const dto = new FindPaginatedPostResponseDto({
            page: Math.floor(offset / limit) + 1,
            limit,
            total,
            data: posts.map((post: Post) => {
                // filter only comments for this post
                const commentsForPost = commentEntities
                    ? commentEntities.filter((c) => c.postId.value === post.id.value)
                    : [];

                return new FindPostResponseDto({
                    id: post.id.value,
                    authorId: post.authorId.value,
                    likesCount: post.likesCount,
                    viewsCount: post.viewsCount,
                    commentsCount: post.commentsCount,
                    status: post.status ?? undefined,
                    tags: post.tags.toArray(),
                    createdAt: post.createdAt.value.toDate(),
                    updatedAt: post.updatedAt.value.toDate(),
                    deletedAt: post.deletedAt?.toDate() ?? undefined,
                    title: post.title.value,
                    content: post.content.value,

                    media: post.media
                        ? post.media.toJSON().items.map(
                              (m) =>
                                  new MediaItemResponseDto({
                                      url: m.url,
                                      type: m.type,
                                      size: m.size,
                                      duration: m.duration ?? undefined,
                                  }),
                          )
                        : [],

                    comments: commentsForPost.map(
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
                                parentId: c.parentId?.value ?? null,
                            }),
                    ),
                });
            }),
        });

        return Ok(dto);
    }
}
