import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { User } from './domain/user.entity';
import { Username } from '../auth/domain/value-objects/username.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { Email } from '../auth/domain/value-objects/email.vo';
import { UserAuthDbRecord, UserDbRecord, UserDbRecordArray } from 'src/db/db.records';
import { UserCollection } from './domain/collections/users.collection';
import { Injectable } from '@nestjs/common';
import { UserAuth, UserAuthWithRole } from './domain/user-auth.entity';
import { Password } from '../auth/domain/value-objects/password.vo';
import { Role } from './domain/value-objects/roles.vo';

@Injectable()
export class UserMapper {
    toEntity(dr: UserDbRecord): User {
        return User.create({
            id: Uuid4.from(dr.id),
            email: Email.create(dr.email),
            username: Username.create(dr.username),
            avatar: dr.avatar ? MediaURL.create(dr.avatar) : null,
            updatedAt: UpdatedAt.from(dr.updatedAt),
            createdAt: CreatedAt.from(dr.createdAt),
        });
    }

    toAuthEntity(dr: UserAuthDbRecord): UserAuthWithRole {
        const u = UserAuth.create({
            userId: Uuid4.from(dr.auth.userId),
            password: Password.create(dr.auth.password),
            lastPasswordChange: dr.auth.lastPasswordChange
                ? UpdatedAt.from(dr.auth.lastPasswordChange)
                : undefined,
            failedLoginAttempts: dr.auth.failedLoginAttempts,
        });

        const role = Role.create(dr.role);

        const result: UserAuthWithRole = {
            auth: {
                userId: u.userId,
                password: u.password,
                lastPasswordChange: u.lastPasswordChange,
                failedLoginAttempts: u.failedLoginAttempts,
            },
            role,
        };

        return result;
    }

    toCollection(dr: UserDbRecordArray): UserCollection {
        const col = UserCollection.create();

        dr.forEach((r) => {
            col.add(
                User.create({
                    id: Uuid4.from(r.id),
                    email: Email.create(r.email),
                    username: Username.create(r.username),
                    avatar: r.avatar ? MediaURL.create(r.avatar) : null,
                    updatedAt: UpdatedAt.from(r.updatedAt),
                    createdAt: CreatedAt.from(r.createdAt),
                }),
            );
        });

        return col;
    }
}
