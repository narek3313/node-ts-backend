import {
    Controller,
    Get,
    NotFoundException as Http404,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { GetUserByIdQuery } from './find-users.query-handler';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, match } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FindUserResponseDto } from './find-user.response.dto';
import { Roles, ROLES_ENUM, RolesGuard } from 'src/libs/decorators/role.decorator';
import { ApiCookie } from 'src/libs/decorators/swagger-decorators';

@ApiTags('Users')
@Controller(routesV1.version)
@UseGuards(RolesGuard)
@Roles(ROLES_ENUM.ADMIN, ROLES_ENUM.MODERATOR)
export class FindUsersHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(`${routesV1.user.root}/:id`)
    @ApiCookie()
    @ApiOperation({
        summary: 'Get user by ID',
        description:
            'Retrieves a single user by their unique UUIDv4 identifier. Requires cookies: refreshToken and sessionId for authentication.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'The UUIDv4 of the user.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'User found and returned successfully.',
        type: FindUserResponseDto,
        examples: {
            example: {
                summary: 'Successful find response',
                value: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    username: 'janedoe',
                    email: 'jane.doe@example.com',
                    updatedAt: '2025-10-23T09:18:58.748Z',
                    createdAt: '2025-10-23T09:18:58.748Z',
                    avatar: null,
                },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'User not found.',
        schema: {
            example: {
                statusCode: 404,
                message: 'User not found',
                error: 'Not Found',
            },
        },
    })
    async getUserById(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: string) {
        const query = new GetUserByIdQuery(Uuid4.from(_id));

        const result: Result<FindUserResponseDto, NotFoundException> =
            await this.queryBus.execute(query);

        return match(result, {
            Ok: (user: FindUserResponseDto) => user,
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }
}
