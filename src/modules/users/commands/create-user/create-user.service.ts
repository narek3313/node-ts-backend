import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { User } from '../../domain/user.entity';
import { Result, Ok, Err } from 'oxide.ts';
import { UserAlreadyExistsError } from '../../user.errors';
import { UserRepository } from '../../infrastructure/user.repository';
import { Prisma } from '@prisma/client';
import { UserAuth } from '../../domain/user-auth.entity';
import { hashPassword } from 'src/libs/utils/hash';
import { Password } from 'src/modules/auth/domain/value-objects/password.vo';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';

/**
 * @commandhandler CreateUserService
 * @description
 * Handles the creation of a new user. Converts domain value objects
 * into entities and persists both the User and UserAuth records.
 * Returns the newly created user's ID or an error if the user already exists.
 */
@CommandHandler(CreateUserCommand)
export class CreateUserService
    implements ICommandHandler<CreateUserCommand, Result<Uuid4, UserAlreadyExistsError>>
{
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepository,
    ) {}

    /**
     * @method execute
     * @description Executes the CreateUserCommand:
     * 1. Builds User and UserAuth entities.
     * 2. Hashes the password.
     * 3. Persists both entities through the repository.
     * @param {CreateUserCommand} command The command containing email, username, and password VOs.
     * @returns {Promise<Result<Uuid4, UserAlreadyExistsError>>} The new user's ID if successful,
     * or an error if the user already exists.
     */
    async execute(command: CreateUserCommand): Promise<Result<Uuid4, UserAlreadyExistsError>> {
        const user = User.create({
            email: command.email,
            username: command.username,
        });

        const passwordHash = Password.create(hashPassword(command.password.value));

        const userAuth = UserAuth.create({ userId: user.id, password: passwordHash });

        try {
            await this.userRepo.create(user, userAuth);
            return Ok(user.id);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return Err(new UserAlreadyExistsError());
            }

            throw err;
        }
    }
}
