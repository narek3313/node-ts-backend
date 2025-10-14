import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserEmailCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

@CommandHandler(ChangeUserEmailCommand)
export class UpdateEmailService
    implements
        ICommandHandler<
            ChangeUserEmailCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    async execute(
        command: ChangeUserEmailCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            await this.userRepo.updateEmail(command.userId, command.email);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
