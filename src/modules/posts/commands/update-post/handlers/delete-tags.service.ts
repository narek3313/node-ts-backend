import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { DeletePostTagsCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler DeletePostTagsService
 * @description
 * Handles removing tags from a post using the PostTags value object.
 */
@CommandHandler(DeletePostTagsCommand)
export class DeletePostTagsService
    implements ICommandHandler<DeletePostTagsCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: DeletePostTagsCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const post = await this.postRepo.findById(command.postId);
            if (!post) {
                return Err(new NotFoundException('Post not found'));
            }

            post.removeTags(command.tags.toArray());

            await this.postRepo.removeTags(post.id, post.tags);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
