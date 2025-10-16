import { Body, Controller, Post, BadRequestException as Http400 } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { CreatePostRequestDto } from './create-post.request.dto';
import { CreatePostCommand } from './create-post.command';
import { Title } from '../../domain/value-objects/title.vo';
import { Content } from '../../domain/value-objects/content.vo';
import { PostTags } from '../../domain/value-objects/post-tags.vo';
import { MediaCollection } from '../../domain/value-objects/media-collection.vo';
import { Result, match } from 'oxide.ts';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { InvalidPostDataError } from '../../post.errors';
import { IdResponse } from 'src/libs/api/id.response.dto';

/**
 * @controller CreatePostHttpController
 * @description
 * Handles post creation requests. Uses the CQRS CommandBus
 * to execute the create post command and returns the new post's ID.
 * Validates and wraps incoming data into domain value objects before
 * passing them to the command layer for additional domain-level validation.
 */
@Controller(routesV1.post.root)
export class CreatePostHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route POST /posts
     * @description Creates a new post with title, content, tags, and optional media attachments.
     * Converts incoming raw data into domain value objects to ensure type safety
     * and enforce business rules at the domain level.
     *
     * @param {CreatePostRequestDto} body - Incoming request body containing post data.
     * @returns {IdResponse} The ID of the newly created post.
     *
     * @throws {Http400} When the post data fails domain validation
     * or Prisma detects invalid input (e.g. constraint violations).
     *
     */
    @Post(routesV1.post.root)
    async create(@Body() body: CreatePostRequestDto) {
        const mediaCollection = MediaCollection.createFromArray(body.media);
        const command = new CreatePostCommand({
            authorId: Uuid4.create(),
            title: Title.create(body.title),
            content: Content.create(body.content),
            tags: PostTags.create(body.tags),
            media: mediaCollection,
        });

        const result: Result<Uuid4, InvalidPostDataError> = await this.commandBus.execute(command);

        match(result, {
            Ok: (id: Uuid4) => new IdResponse(id),
            Err: (err: Error) => {
                if (err instanceof InvalidPostDataError) {
                    throw new Http400(err);
                }
                throw err;
            },
        });
    }
}
