import {
    Body,
    Controller,
    Patch,
    Param,
    ParseUUIDPipe,
    NotFoundException as Http404,
    ConflictException as Http409,
    BadRequestException as Http400,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { UpdateEmailDto } from './dtos/update-email.request.dto';
import {
    ChangeUserAvatarCommand,
    ChangeUserEmailCommand,
    ChangeUserPasswordCommand,
    ChangeUserUsernameCommand,
} from './update-user.command';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { InvalidPasswordError, UniqueConstraintError } from '../../user.errors';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Result, match } from 'oxide.ts';
import { UpdateUsernameDto } from './dtos/update-username.request.dto';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { UpdatePasswordDto } from './dtos/update-password.request.dto';
import { UpdateAvatarDto } from './dtos/update-avatar.request.dto';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';

/**
 * @controller UpdateUserHttpController
 * @description
 * Handles user profile update operations such as changing email, username,
 * password, and avatar. Uses the CQRS CommandBus to execute user update commands.
 */
@Controller(routesV1.version)
export class UpdateUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route PATCH /users/:id/email
     * @description Updates the user's email address.
     * @throws {Http404} When the user is not found.
     * @throws {Http409} When the email is already taken.
     */
    @Patch(`${routesV1.user.root}/:id/email`)
    async updateEmail(
        @Body() body: UpdateEmailDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const email = Email.create(body.email);
        const userId = Uuid4.from(_id);
        const command = new ChangeUserEmailCommand({ email, userId });

        const result: Result<boolean, NotFoundException | UniqueConstraintError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) {
                    throw new Http404(err);
                }
                if (err instanceof UniqueConstraintError) {
                    throw new Http409(err);
                }
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/:id/username
     * @description Updates the user's username.
     * @throws {Http404} When the user is not found.
     * @throws {Http409} When the username is already taken.
     */
    @Patch(`${routesV1.user.root}/:id/username`)
    async updateUsername(
        @Body() body: UpdateUsernameDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const username = Username.create(body.username);
        const userId = Uuid4.from(_id);
        const command = new ChangeUserUsernameCommand({ username, userId });

        const result: Result<boolean, NotFoundException | UniqueConstraintError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                if (err instanceof UniqueConstraintError) throw new Http409(err);
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/:id/password
     * @description Updates the user's password after validating the old one.
     * @throws {Http404} When the user is not found.
     * @throws {Http400} When the old password is invalid.
     */
    @Patch(`${routesV1.user.root}/:id/password`)
    async updatePassword(
        @Body() body: UpdatePasswordDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const oldPassword = Password.create(body.oldPassword);
        const newPassword = Password.create(body.newPassword);
        const userId = Uuid4.from(_id);
        const command = new ChangeUserPasswordCommand({ userId, oldPassword, newPassword });

        const result: Result<boolean, NotFoundException | InvalidPasswordError> =
            await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                if (err instanceof InvalidPasswordError) throw new Http400(err);
                throw err;
            },
        });
    }

    /**
     * @route PATCH /users/:id/avatar
     * @description Updates the user's avatar URL.
     * @throws {Http404} When the user is not found.
     */
    @Patch(`${routesV1.user.root}/:id/avatar`)
    async updateAvatar(
        @Body() body: UpdateAvatarDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const avatar = MediaURL.create(body.avatar);
        const userId = Uuid4.from(_id);
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
