import { Body, Controller, Post, ConflictException as Http409 } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserCommand } from './create-user.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { UserAlreadyExistsError } from '../../user.errors';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { Result, match } from 'oxide.ts';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { Username } from 'src/modules/auth/domain/value-objects/username.vo';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';

@Controller(routesV1.version)
export class CreateUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(routesV1.user.root)
    async create(@Body() body: CreateUserRequestDto): Promise<IdResponse> {
        const command = new CreateUserCommand({
            /**
             * Converting and validating strings that came over http into domain vo's
             * for additional safety
             */
            email: Email.create(body.email),
            username: Username.create(body.username),
            password: Password.create(body.password),
        });

        const result: Result<Uuid4, UserAlreadyExistsError> =
            await this.commandBus.execute(command);

        return match(result, {
            Ok: (id: Uuid4) => new IdResponse(id),
            Err: (err: Error) => {
                if (err instanceof UserAlreadyExistsError) {
                    throw new Http409(err.message);
                }
                throw err;
            },
        });
    }
}
