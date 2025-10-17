import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { AddPostMediaCommand } from '../update-post.command';

/**
 * @commandhandler AddPostMediaService
 * @description
 * Handles adding media items to a post using the MediaCollection value object.
 */
@CommandHandler(AddPostMediaCommand)
export class AddPostMediaService
    implements ICommandHandler<AddPostMediaCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly postRepo: PostRepository) {}

    async execute(command: AddPostMediaCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const post = await this.postRepo.findById(command.postId);
            if (!post) {
                return Err(new NotFoundException('Post not found'));
            }

            post.addMedia(command.media.toArray());

            await this.postRepo.addMedia(post.id, post.mediaCollection);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
