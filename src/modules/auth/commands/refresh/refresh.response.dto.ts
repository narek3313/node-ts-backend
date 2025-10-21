import { AccessToken } from '../../domain/value-objects/access-token.vo';
import { RefreshToken } from '../../refresh-token.entity';

export class RefreshResponse {
    constructor(
        private readonly accessToken: AccessToken,
        private readonly refreshToken: RefreshToken,
    ) {}

    toObject() {
        return {
            accessToken: this.accessToken.token.value,
            refreshToken: this.refreshToken.token.value,
        };
    }
}
