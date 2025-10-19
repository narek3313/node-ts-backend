import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserEmailCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/modules/users/user.di-tokens';

/**
 * @commandhandler UpdateEmailService
 * @description
 * Handles user email updates through the domain model.
 * Loads the user aggregate, applies domain logic, and persists changes.
 */
@CommandHandler(ChangeUserEmailCommand)
export class UpdateEmailService
    implements
        ICommandHandler<
            ChangeUserEmailCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepository) {}

    async execute(
        command: ChangeUserEmailCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            const user = await this.userRepo.findById(command.userId);
            if (!user) {
                return Err(new NotFoundException('User not found'));
            }

            user.updateEmail(command.email);

            await this.userRepo.updateEmail(user.id, user.email);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
