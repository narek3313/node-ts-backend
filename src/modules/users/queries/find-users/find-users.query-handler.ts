import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../infrastructure/user.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, Err, Ok } from 'oxide.ts';
import { User } from '../../domain/user.entity';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';

export class GetUserByIdQuery {
    constructor(public readonly id: Uuid4) {}
}

export class GetUserByEmailQuery {
    constructor(public readonly email: Email) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepository) {}

    async execute(query: GetUserByIdQuery): Promise<Result<User, NotFoundException>> {
        const user = await this.userRepo.findById(query.id);
        if (!user) {
            return Err(new NotFoundException(`User not found`));
        }
        return Ok(user);
    }
}

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepository) {}

    async execute(query: GetUserByEmailQuery): Promise<Result<User, NotFoundException>> {
        const user = await this.userRepo.findByEmail(query.email);
        if (!user) {
            return Err(new NotFoundException(`User not found`));
        }
        return Ok(user);
    }
}
