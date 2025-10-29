import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { DeleteCommentCommand } from './delete-comment.command';
import { COMMENT_REPOSITORY } from '../../comments.di-tokens';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { CommentDeleteError } from '../../comment.errors';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentService implements ICommandHandler<DeleteCommentCommand> {
    constructor(@Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository) {}

    async execute(command: DeleteCommentCommand): Promise<Result<Uuid4, CommentDeleteError>> {
        try {
            const comment = await this.commentRepo.findById(command.commentId);
            if (!comment) {
                return Err(new CommentDeleteError());
            }

            if (!comment.authorId.equals(command.authorId)) {
                return Err(new CommentDeleteError());
            }

            await this.commentRepo.delete(comment.id);

            return Ok(comment.id);
        } catch (err) {
            return Err(new CommentDeleteError(err));
        }
    }
}
