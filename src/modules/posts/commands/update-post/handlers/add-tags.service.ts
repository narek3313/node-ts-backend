import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';
import { AddPostTagsCommand } from '../update-post.command';

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
    constructor(private readonly postRepo: PostRepository) {}

    async execute(command: AddPostTagsCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const post = await this.postRepo.findById(command.postId);
            if (!post) {
                return Err(new NotFoundException('Post not found'));
            }

            post.addTags(command.tags.toArray());

            await this.postRepo.addTags(post.id, post.tags);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
