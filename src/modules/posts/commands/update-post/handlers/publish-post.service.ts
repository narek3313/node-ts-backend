import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PublishPostCommand } from '../update-post.command';
import { Result, Err, Ok } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';

@CommandHandler(PublishPostCommand)
export class PublisPostService
    implements ICommandHandler<PublishPostCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: PublishPostCommand): Promise<Result<boolean, NotFoundException>> {
        const published = await this.postRepo.publish(command.postId);

        if (!published) {
            return Err(new NotFoundException());
        }

        return Ok(true);
    }
}
