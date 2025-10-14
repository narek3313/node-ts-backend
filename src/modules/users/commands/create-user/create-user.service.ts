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

@CommandHandler(CreateUserCommand)
export class CreateUserService
    implements ICommandHandler<CreateUserCommand, Result<Uuid4, UserAlreadyExistsError>>
{
    constructor(private readonly userRepo: UserRepository) {}

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
                return Err(new UserAlreadyExistsError(err));
            }

            throw err;
        }
    }
}
