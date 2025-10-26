import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { AddPostTagsCommand } from '../update-post.command';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';

/**
 * @commandhandler AddPostTagsService
 * @description
 * Handles adding tags to a post. Applies the PostTags value object
 * and domain logic inside the aggregate.
 */
@CommandHandler(AddPostTagsCommand)
export class AddPostTagsService
    implements ICommandHandler<AddPostTagsCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: AddPostTagsCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const _tags = await this.postRepo.getTagsById(command.postId);
            if (!_tags) {
                return Err(new NotFoundException('Post not found'));
            }

            const tags = _tags.add(command.tags.toArray());

            await this.postRepo.addTags(command.postId, tags);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
