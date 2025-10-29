import {
    Controller,
    Get,
    NotFoundException as Http404,
    Param,
    ParseUUIDPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, match } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FindPaginatedPostResponseDto, FindPostResponseDto } from './find-post.response.dto';
import { Roles, ROLES_ENUM, RolesGuard } from 'src/libs/decorators/role.decorator';
import { ApiCookie } from 'src/libs/decorators/swagger-decorators';
import { GetPostByIdQuery, GetPostsByUserQuery } from './find-post.query-handler';

@ApiTags('Posts')
@Controller(routesV1.version)
@UseGuards(RolesGuard)
@Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.MODERATOR)
export class FindPostsHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(`${routesV1.post.root}/:id`)
    @ApiCookie()
    @ApiOperation({
        summary: 'Get post by ID',
        description:
            'Retrieves a single post by its unique UUIDv4 identifier. Requires cookies: refreshToken and sessionId for authentication.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'The UUIDv4 of the post.',
        example: '660e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Post found and returned successfully.',
        type: FindPostResponseDto,
        examples: {
            example: {
                summary: 'Successful find response',
                value: {
                    id: '660e8400-e29b-41d4-a716-446655440000',
                    title: 'My first post',
                    content: 'This is the post content.',
                    authorId: '550e8400-e29b-41d4-a716-446655440000',
                    updatedAt: '2025-10-23T09:18:58.748Z',
                    createdAt: '2025-10-23T09:18:58.748Z',
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Post not found.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Post not found',
                error: 'Not Found',
            },
        },
    })
    async getPostById(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: string) {
        const query = new GetPostByIdQuery(Uuid4.from(_id));

        const result: Result<FindPostResponseDto, NotFoundException> =
            await this.queryBus.execute(query);

        return match(result, {
            Ok: (post: FindPostResponseDto) => post,
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }

    @Get(`${routesV1.post.root}/user/:userId`)
    @ApiCookie()
    @ApiOperation({
        summary: 'Get posts by user',
        description:
            'Retrieves paginated posts for a given user UUIDv4. Requires cookies for authentication.',
    })
    @ApiResponse({
        status: 200,
        description: 'Posts found and returned successfully.',
        type: FindPostResponseDto,
        isArray: true,
    })
    @ApiResponse({
        status: 404,
        description: 'No posts found for the user.',
        schema: {
            example: {
                statusCode: 404,
                message: 'No posts found',
                error: 'Not Found',
            },
        },
    })
    async getPostByUser(
        @Param('userId', new ParseUUIDPipe({ version: '4' })) _userId: string,
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        const query = new GetPostsByUserQuery(Uuid4.from(_userId), Number(offset), Number(limit));
        const result: Result<FindPaginatedPostResponseDto, NotFoundException> =
            await this.queryBus.execute(query);

        return match(result, {
            Ok: (dto) => dto,
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }
}
