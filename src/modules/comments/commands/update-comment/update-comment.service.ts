import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentCommand } from './update-comment.command';
import { Inject } from '@nestjs/common';
import { Result, Ok, Err } from 'oxide.ts';
import { CommentUpdateError } from '../../comment.errors';
import { COMMENT_REPOSITORY } from '../../comments.di-tokens';
import { CommentRepository } from '../../infrastructure/comment.repository';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentService implements ICommandHandler<UpdateCommentCommand> {
    constructor(@Inject(COMMENT_REPOSITORY) private readonly commentRepo: CommentRepository) {}

    async execute(command: UpdateCommentCommand): Promise<Result<boolean, CommentUpdateError>> {
        try {
            await this.commentRepo.updateContent(command.commentId, command.content);

            return Ok(true);
        } catch (err) {
            return Err(new CommentUpdateError(err));
        }
    }
}
