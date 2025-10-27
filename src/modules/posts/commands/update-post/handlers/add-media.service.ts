import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { AddPostMediaCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

/**
 * @commandhandler AddPostMediaService
 * @description
 * Handles adding media items to a post using the MediaCollection value object.
 */
@CommandHandler(AddPostMediaCommand)
export class AddPostMediaService
    implements ICommandHandler<AddPostMediaCommand, Result<Uuid4, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: AddPostMediaCommand): Promise<Result<Uuid4, NotFoundException>> {
        try {
            const postMedia = await this.postRepo.getMediaById(command.postId);
            if (!postMedia) {
                return Err(new NotFoundException('Post not found'));
            }

            const mediaItemId = await this.postRepo.addMedia(postMedia.id!, command.media.items[0]);

            return Ok(mediaItemId);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
