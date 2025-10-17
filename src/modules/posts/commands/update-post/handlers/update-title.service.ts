import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { ChangePostTitleCommand } from '../update-post.command';

/**
 * @commandhandler UpdatePostTitleService
 * @description
 * Handles updating a post's title. Attempts to update the title
 * through the PostRepository and returns a Result indicating success
 * or an error if the post is not found
 */
@CommandHandler(ChangePostTitleCommand)
export class UpdatePostTitleService
    implements ICommandHandler<ChangePostTitleCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly postRepo: PostRepository) {}

    /**
     * Executes the ChangePostTitleCommand:
     * 1. Updates the post's title in the repository.
     * 2. Returns Result.Ok(true) if successful.
     * 3. Returns Result.Err if the post does not exist
     *
     * @param {ChangePostTitleCommand} command Contains the postId and new title.
     * @returns {Promise<Result<boolean, NotFoundException>>}
     */
    async execute(command: ChangePostTitleCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            await this.postRepo.updateTitle(command.postId, command.title);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
