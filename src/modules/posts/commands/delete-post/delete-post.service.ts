import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Result, Ok, Err } from 'oxide.ts';
import { DeletePostCommand } from './delete-post.command';
import { PostRepository } from '../../infrastructure/post.repository';
import { POST_REPOSITORY } from '../../post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler DeletePostService
 * @description
 * Handles deletion of a post. Attempts to mark the post
 * as deleted in the repository and returns a Result indicating success
 * or an error if the post does not exist.
 */
@CommandHandler(DeletePostCommand)
export class DeletePostService
    implements ICommandHandler<DeletePostCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    /**
     * @method execute
     * @description Executes the DeletePostCommand:
     * 1. Attempts to mark the post as deleted in the repository.
     * 2. Returns Result.Ok(true) if deletion was successful.
     * 3. Returns Result.Err(NotFoundException) if the post does not exist.
     * @param {DeletePostCommand} command Contains the postId to delete.
     * @returns {Promise<Result<boolean, NotFoundException>>}
     */
    async execute(command: DeletePostCommand): Promise<Result<boolean, NotFoundException>> {
        const deleted = await this.postRepo.delete(command.postId);

        if (!deleted) return Err(new NotFoundException());

        return Ok(true);
    }
}
