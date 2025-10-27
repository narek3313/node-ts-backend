import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { DeletePostMediaCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler DeletePostMediaService
 * @description
 * Handles removing a media item from a post by its ID.
 */
@CommandHandler(DeletePostMediaCommand)
export class DeletePostMediaService
    implements ICommandHandler<DeletePostMediaCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: DeletePostMediaCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const postExists = await this.postRepo.existsById(command.postId);
            if (!postExists) {
                return Err(new NotFoundException('Post not found'));
            }

            await this.postRepo.removeMedia(command.postId, command.mediaItemId);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
