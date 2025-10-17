import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserPasswordCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { hashPassword, verifyPassword } from 'src/libs/utils/hash';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { InvalidPasswordError } from 'src/modules/users/user.errors';

/**
 * @commandhandler UpdatePasswordService
 * @description
 * Handles user password updates. Verifies the old password against the stored hash,
 * hashes the new password, and persists it through the UserRepository.
 * Returns a Result indicating success or an error if the user is not found or
 * the old password is invalid.
 */
@CommandHandler(ChangeUserPasswordCommand)
export class UpdatePasswordService
    implements
        ICommandHandler<
            ChangeUserPasswordCommand,
            Result<boolean, NotFoundException | InvalidPasswordError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    /**
     * @method execute
     * @description Executes the ChangeUserPasswordCommand:
     * 1. Retrieves the stored password for the user.
     * 2. Validates the old password.
     * 3. Hashes and updates the new password in the repository.
     * @param {ChangeUserPasswordCommand} command Contains userId, oldPassword, and newPassword VOs.
     * @returns {Promise<Result<boolean, NotFoundException | InvalidPasswordError>>}
     * Result.Ok(true) if password was updated successfully,
     * or Result.Err with NotFoundException / InvalidPasswordError.
     */
    async execute(
        command: ChangeUserPasswordCommand,
    ): Promise<Result<boolean, NotFoundException | InvalidPasswordError>> {
        try {
            const stored = await this.userRepo.getPassword(command.userId);

            if (!stored) {
                return Err(new NotFoundException());
            }

            const valid = verifyPassword(command.oldPassword.value, stored.value);

            if (!valid) {
                return Err(new InvalidPasswordError());
            }

            const password = Password.create(hashPassword(command.newPassword.value));

            await this.userRepo.updatePassword(command.userId, password);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof InvalidPasswordError) {
                return Err(err);
            }
            throw err;
        }
    }
}
