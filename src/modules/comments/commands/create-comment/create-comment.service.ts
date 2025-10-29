import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { CreateCommentCommand, CreateReplyCommand } from './create-comment.command';
import { COMMENT_REPOSITORY } from '../../comments.di-tokens';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { CommentCreateError } from '../../comment.errors';
import { Comment } from '../../comment.entity';
import { PostNotFoundError } from 'src/modules/posts/post.errors';

@CommandHandler(CreateCommentCommand)
export class CreateCommentService implements ICommandHandler<CreateCommentCommand> {
    constructor(@Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository) {}

    async execute(command: CreateCommentCommand): Promise<Result<Uuid4, CommentCreateError>> {
        try {
            const comment = Comment.create({
                content: command.content,
                authorId: command.authorId,
                postId: command.postId,
            });

            const commentId = await this.commentRepo.create(comment);

            return Ok(commentId);
        } catch (err) {
            return Err(new CommentCreateError(err));
        }
    }
}

@CommandHandler(CreateReplyCommand)
export class CreateReplyService implements ICommandHandler<CreateReplyCommand> {
    constructor(@Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository) {}

    async execute(command: CreateReplyCommand): Promise<Result<Uuid4, CommentCreateError>> {
        try {
            const postId = await this.commentRepo.getPostIdbyId(command.parentId);
            if (!postId) {
                throw new PostNotFoundError();
            }
            const reply = Comment.create({
                postId,
                content: command.content,
                authorId: command.authorId,
                parentId: command.parentId,
            });

            const replyId = await this.commentRepo.create(reply);

            return Ok(replyId);
        } catch (err) {
            return Err(new CommentCreateError(err));
        }
    }
}
