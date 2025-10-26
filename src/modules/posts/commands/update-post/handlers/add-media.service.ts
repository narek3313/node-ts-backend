import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { AddPostMediaCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler AddPostMediaService
 * @description
 * Handles adding media items to a post using the MediaCollection value object.
 */
@CommandHandler(AddPostMediaCommand)
export class AddPostMediaService
    implements ICommandHandler<AddPostMediaCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: AddPostMediaCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const postMedia = await this.postRepo.getMediaById(command.postId);
            if (!postMedia) {
                return Err(new NotFoundException('Post not found'));
            }

            await this.postRepo.addMedia(postMedia.id!, command.media.items[0]);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
