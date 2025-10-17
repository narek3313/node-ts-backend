import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { DeletePostMediaCommand } from '../update-post.command';

/**
 * @commandhandler DeletePostMediaService
 * @description
 * Handles removing a media item from a post by its ID.
 */
@CommandHandler(DeletePostMediaCommand)
export class DeletePostMediaService
    implements ICommandHandler<DeletePostMediaCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly postRepo: PostRepository) {}

    async execute(command: DeletePostMediaCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const post = await this.postRepo.findById(command.postId);
            if (!post) {
                return Err(new NotFoundException('Post not found'));
            }

            post.removeMedia(command.media);

            await this.postRepo.removeMedia(post.id, command.media.id);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
