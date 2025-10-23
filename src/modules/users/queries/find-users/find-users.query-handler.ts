import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../infrastructure/user.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, Err, Ok } from 'oxide.ts';
import { User } from '../../domain/user.entity';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { Email } from 'src/modules/auth/domain/value-objects/email.vo';
import { FindUserResponseDto } from './find-user.response.dto';
import { PaginatedResponseDto } from 'src/libs/api/paginated.response.dto';

export class GetUserByIdQuery {
    constructor(public readonly id: Uuid4) {}
}

export class GetUserByEmailQuery {
    constructor(public readonly email: Email) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepo: UserRepository) {}

    async execute(
        query: GetUserByIdQuery,
    ): Promise<Result<FindUserResponseDto, NotFoundException>> {
        const user = await this.userRepo.findById(query.id);

        if (!user) {
            return Err(new NotFoundException('User not found'));
        }

        const dto = new FindUserResponseDto({
            id: user.id.value,
            username: user.username.value,
            email: user.email.value,
            avatar: user.avatar?.value ?? null,
            updatedAt: user.updatedAt.value.toDate(),
            createdAt: user.createdAt.value.toDate(),
        });

        return Ok(dto);
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
