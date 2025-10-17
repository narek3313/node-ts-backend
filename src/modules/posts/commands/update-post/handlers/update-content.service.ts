import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { ChangePostContentCommand } from '../update-post.command';

/**
 * @commandhandler UpdatePostContentService
 * @description
 * Handles updating a post's content. Attempts to update the content
 * through the PostRepository and returns a Result indicating success
 * or an error if the post is not found
 */
@CommandHandler(ChangePostContentCommand)
export class UpdatePostContentService
    implements ICommandHandler<ChangePostContentCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly postRepo: PostRepository) {}

    /**
     * Executes the ChangePostContentCommand:
     * 1. Updates the post's content in the repository.
     * 2. Returns Result.Ok(true) if successful.
     * 3. Returns Result.Err if the post does not exist
     *
     * @param {ChangePostContentCommand} command Contains the postId and new content.
     * @returns {Promise<Result<boolean, NotFoundException>>}
     */
    async execute(command: ChangePostContentCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            await this.postRepo.updateContent(command.postId, command.content);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
