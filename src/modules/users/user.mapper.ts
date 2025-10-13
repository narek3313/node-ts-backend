import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { User } from './domain/user.entity';
import { Username } from '../auth/domain/value-objects/username.vo';
import { MediaURL } from 'src/shared/domain/value-objects/media-url.vo';
import { UpdatedAt } from 'src/shared/domain/value-objects/updated-at.vo';
import { CreatedAt } from 'src/shared/domain/value-objects/created-at.vo';
import { Email } from '../auth/domain/value-objects/email.vo';

export type userDbRecord = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string | null;
    sessions: sessionDbRecord[];
};

export type sessionDbRecord = {
    id: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    userAgent: string;
    ipAddress: string;
    revokedAt: Date | null;
};

export class UserMapper {
    static createUserEntityFromDbRecord(dr: userDbRecord): User {
        return User.create({
            id: Uuid4.from(dr.id),
            email: Email.create(dr.email),
            username: Username.create(dr.username),
            avatar: dr.avatar ? MediaURL.create(dr.avatar) : null,
            updatedAt: UpdatedAt.from(dr.updatedAt),
            createdAt: CreatedAt.from(dr.createdAt),
        });
    }
}
