import {
    Body,
    Controller,
    Patch,
    UseGuards,
    Req,
    NotFoundException as Http404,
    ConflictException as Http409,
    BadRequestException as Http400,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';

import { routesV1 } from 'src/configs/app.routes';
import { UpdateEmailDto } from './dtos/update-email.request.dto';
import { UpdateUsernameDto } from './dtos/update-username.request.dto';
import { UpdatePasswordDto } from './dtos/update-password.request.dto';
import { UpdateAvatarDto } from './dtos/update-avatar.request.dto';
import {
    ChangeUserAvatarCommand,
    ChangeUserEmailCommand,
    ChangeUserPasswordCommand,
    ChangeUserUsernameCommand,
} from './update-user.command';

import {
    InvalidOldPasswordError,
    SamePasswordError,
    UniqueConstraintError,
} from '../../user.errors';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Result, match } from 'oxide.ts';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { JwtAuthGuard, type RequestWithUser } from 'src/modules/auth/jwt/jwt.strategy';
import { ApiCookie } from 'src/libs/decorators/swagger-decorators';

/**
 * @controller UpdateUserHttpController
 * @description
 * Handles user profile updates (email, username, password, avatar).
 */
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(routesV1.version)
export class UpdateUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route PATCH /users/email
     * @description Update the authenticated user's email.
     */
    @Patch(`${routesV1.user.root}/email`)
    @ApiCookie()
    @ApiOperation({ summary: 'Update user email' })
    @ApiBody({
        type: UpdateEmailDto,
        examples: {
            example: {
                summary: 'Sample email',
                value: {
                    email: 'jane.doe@example.com',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Email updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Email already taken' })
    async updateEmail(@Body() body: UpdateEmailDto, @Req() req: RequestWithUser): Promise<void> {
        const userId = Uuid4.from(req.user!.sub);
        const email = Email.create(body.email);
        const command = new ChangeUserEmailCommand({ email, userId });

        const result: Result<boolean, NotFoundException | UniqueConstraintError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                if (err instanceof UniqueConstraintError) throw new Http409(err.message);
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/username
     * @description Update the authenticated user's username.
     */
    @Patch(`${routesV1.user.root}/username`)
    @ApiCookie()
    @ApiOperation({ summary: 'Update user username' })
    @ApiBody({
        type: UpdateUsernameDto,
        examples: {
            example: {
                summary: 'Sample username',
                value: {
                    username: 'newusername',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Username updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Username already exists' })
    async updateUsername(
        @Body() body: UpdateUsernameDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        const userId = Uuid4.from(req.user!.sub);
        const username = Username.create(body.username);
        const command = new ChangeUserUsernameCommand({ username, userId });

        const result: Result<boolean, NotFoundException | UniqueConstraintError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                if (err instanceof UniqueConstraintError)
                    throw new Http409('Username already exists');
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/password
     * @description Update the authenticated user's password.
     */
    @Patch(`${routesV1.user.root}/password`)
    @ApiCookie()
    @ApiOperation({ summary: 'Update user password' })
    @ApiBody({
        type: UpdatePasswordDto,
        examples: {
            example: {
                summary: 'Sample password',
                value: {
                    password: 'StringPass333!',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Password updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or same password' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updatePassword(
        @Body() body: UpdatePasswordDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        const userId = Uuid4.from(req.user!.sub);
        const oldPassword = Password.create(body.oldPassword);
        const newPassword = Password.create(body.newPassword);
        const command = new ChangeUserPasswordCommand({ userId, oldPassword, newPassword });

        const result: Result<
            boolean,
            NotFoundException | InvalidOldPasswordError | SamePasswordError
        > = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                if (err instanceof InvalidOldPasswordError || err instanceof SamePasswordError)
                    throw new Http400(err.message);
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/avatar
     * @description Update the authenticated user's avatar URL.
     */
    @Patch(`${routesV1.user.root}/avatar`)
    @ApiCookie()
    @ApiOperation({ summary: 'Update user avatar' })
    @ApiBody({
        type: UpdateAvatarDto,
        examples: {
            example: {
                summary: 'Sample avatar',
                value: {
                    avatar: '',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateAvatar(@Body() body: UpdateAvatarDto, @Req() req: RequestWithUser): Promise<void> {
        const userId = Uuid4.from(req.user!.sub);
        const avatar = MediaURL.create(body.avatar);
        const command = new ChangeUserAvatarCommand({ avatar, userId });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }
}
