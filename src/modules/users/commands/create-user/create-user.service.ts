import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { User } from '../../domain/user.entity';
import { Result, Ok, Err } from 'oxide.ts';
import { UserAlreadyExistsError } from '../../user.errors';
import { ConflictException } from 'src/libs/exceptions/exceptions';

@CommandHandler(CreateUserCommand)
export class CreateUserService
    implements ICommandHandler<CreateUserCommand, Result<Uuid4, UserAlreadyExistsError>>
{
    constructor() {}

    async execute(command: CreateUserCommand): Promise<Result<Uuid4, UserAlreadyExistsError>> {
        const user = User.create({
            email: command.email,
            username: command.username,
            password: command.password,
        });

        try {
            // future repo logic
            return Ok(user.id);
        } catch (err) {
            if (err instanceof ConflictException) {
                return Err(new UserAlreadyExistsError(err));
            }

            throw err;
        }
    }
}
