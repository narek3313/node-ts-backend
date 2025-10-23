import {
    Controller,
    Param,
    NotFoundException as Http404,
    ParseUUIDPipe,
    Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { match, Result } from 'oxide.ts';
import { DeleteUserCommand } from './delete-user.command';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ApiCookie } from 'src/libs/decorators/swagger-decorators';

/**
 * @controller DeleteUserHttpController
 * @description
 * Handles user deletion requests. Uses the CQRS CommandBus
 * to execute the delete user command.
 */
@ApiTags('Users')
@Controller(routesV1.version)
export class DeleteUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route DELETE /users/:id
     * @description Deletes a user by ID. Requires cookies: refreshToken and sessionId.
     * @throws {Http404} When the user is not found.
     */
    @Delete(routesV1.user.delete)
    @ApiCookie()
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiForbiddenResponse({
        description: 'Insufficient permissions `Admin and Moderator only`',
    })
    @ApiParam({
        name: 'id',
        description: 'UUID of the user to delete',
        type: String,
        format: 'uuid',
        example: '3f4b7c92-1a35-4f09-a1de-b4b2b321a999',
    })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
        const command = new DeleteUserCommand({ userId: Uuid4.from(id) });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) {
                    throw new Http404(err.message);
                }
                throw err;
            },
        });
    }
}
