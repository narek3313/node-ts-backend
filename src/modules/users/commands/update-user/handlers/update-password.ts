import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserPasswordCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { hashPassword } from 'src/libs/utils/hash';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';

@CommandHandler(ChangeUserPasswordCommand)
export class UpdatePasswordService
    implements ICommandHandler<ChangeUserPasswordCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly userRepo: UserRepository) {}

    async execute(command: ChangeUserPasswordCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            const password = Password.create(hashPassword(command.password.value));

            await this.userRepo.updatePassword(command.userId, password);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
