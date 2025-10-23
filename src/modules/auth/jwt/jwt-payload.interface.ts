import { ROLES_ENUM } from 'src/libs/decorators/role.decorator';

export interface JwtPayload {
    sub: string;
    role: (typeof ROLES_ENUM)[keyof typeof ROLES_ENUM];
}
