import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchivePostCommand } from '../update-post.command';
import { Result, Err, Ok } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { POST_REPOSITORY } from 'src/modules/posts/post.di-tokens';
import { Inject } from '@nestjs/common';
import { PostRepository } from 'src/modules/posts/infrastructure/post.repository';

@CommandHandler(ArchivePostCommand)
export class ArchivePostService
    implements ICommandHandler<ArchivePostCommand, Result<boolean, NotFoundException>>
{
    constructor(@Inject(POST_REPOSITORY) private readonly postRepo: PostRepository) {}

    async execute(command: ArchivePostCommand): Promise<Result<boolean, NotFoundException>> {
        const archived = await this.postRepo.archive(command.postId);

        if (!archived) {
            return Err(new NotFoundException());
        }

        return Ok(true);
    }
}
