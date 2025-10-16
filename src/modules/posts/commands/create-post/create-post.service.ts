import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Result } from 'oxide.ts';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { InvalidPostDataError } from '../../post.errors';
import { PostRepository } from '../../infrastructure/post.repository';
import { Post } from '../../domain/post.entity';
import { Ok, Err } from 'oxide.ts';
import { Prisma } from '@prisma/client';

/**
 * @commandhandler CreatePostService
 * @description
 * Handles the creation of a new post. Converts domain value objects
 * into a Post entity and persists it through the repository.
 * Returns the newly created post's ID or an error if the post data is invalid.
 */
@CommandHandler(CreatePostCommand)
export class CreatePostService
    implements ICommandHandler<CreatePostCommand, Result<Uuid4, InvalidPostDataError>>
{
    constructor(private readonly postRepo: PostRepository) {}

    /**
     * @method execute
     * @description Executes the CreatePostCommand:
     * 1. Builds the Post entity with all its value objects.
     * 2. Persists the Post entity through the repository.
     * @param {CreatePostCommand} command The command containing title, content, tags, and media VOs.
     * @returns {Promise<Result<Uuid4, InvalidPostDataError>>} The new post's ID if successful,
     * or an error if the post data is invalid.
     */
    async execute(command: CreatePostCommand): Promise<Result<Uuid4, InvalidPostDataError>> {
        /*
         * db internally creates a PostMedia table where all the media of the post will go and
         * we pass the id from here, design might be changed
         */
        const postMediaId = Uuid4.create();
        const post = Post.create({
            id: Uuid4.create(),
            content: command.content,
            authorId: command.authorId,
            title: command.title,
            tags: command.tags,
            media: command.media,
        });

        try {
            await this.postRepo.create(post, postMediaId);

            return Ok(post.id);
        } catch (err: unknown) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (['P2009', 'P2002', 'P2011'].includes(err.code)) {
                    return Err(new InvalidPostDataError());
                }
            }
            throw err;
        }
    }
}
