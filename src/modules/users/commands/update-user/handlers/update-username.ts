import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserUsernameCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

@CommandHandler(ChangeUserUsernameCommand)
export class UpdateUsernameService
    implements
        ICommandHandler<
            ChangeUserUsernameCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    async execute(
        command: ChangeUserUsernameCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            await this.userRepo.updateUsername(command.userId, command.username);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
