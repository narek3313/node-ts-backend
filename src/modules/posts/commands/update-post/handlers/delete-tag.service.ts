import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { DeletePostTagCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler DeletePostTagsService
 * @description
 * Handles removing tags from a post using the PostTags value object.
 */
@CommandHandler(DeletePostTagCommand)
export class DeletePostTagService
    implements ICommandHandler<DeletePostTagCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: DeletePostTagCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const _tags = await this.postRepo.getTagsById(command.postId);
            if (!_tags) {
                return Err(new NotFoundException('Post not found'));
            }

            const tags = _tags.remove([command.tag]);

            await this.postRepo.removeTag(command.postId, tags);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
