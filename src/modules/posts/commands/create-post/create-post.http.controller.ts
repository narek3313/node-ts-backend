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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

/**
 * @controller CreatePostHttpController
 * @description
 * Handles post creation requests using CQRS CommandBus.
 * Validates input and returns the new post ID.
 */
@ApiTags('Posts')
@Controller(routesV1.version)
export class CreatePostHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route POST /posts
     * @description
     * Creates a new post with title, content, tags, and optional media.
     */
    @Post(routesV1.post.root)
    @ApiOperation({
        summary: 'Create a new post',
        description:
            'Creates a new post with title, content, tags, and optional media attachments.',
    })
    @ApiBody({ type: CreatePostRequestDto })
    @ApiResponse({
        status: 201,
        description: 'Post created successfully.',
        type: IdResponse,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid post data or domain validation failure.',
        schema: {
            example: {
                statusCode: 400,
                message: 'Invalid title: must be at least 3 characters long',
                error: 'Bad Request',
            },
        },
    })
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

        return match(result, {
            Ok: (id: Uuid4) => new IdResponse(id),
            Err: (err: Error) => {
                if (err instanceof InvalidPostDataError) {
                    throw new Http400(err.message);
                }
                throw err;
            },
        });
    }
}
