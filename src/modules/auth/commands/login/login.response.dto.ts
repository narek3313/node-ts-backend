import { IsString, IsNotEmpty } from 'class-validator';
import { RefreshToken } from '../../refresh-token.entity';
import { AccessToken } from '../../domain/value-objects/access-token.vo';

export class LoginResponse {
    constructor(
        private readonly _refreshToken: RefreshToken,
        private readonly _accessToken: AccessToken,
    ) {}

    static create(rt: RefreshToken, at: AccessToken) {
        return new LoginResponse(rt, at);
    }

    toObject() {
        return {
            accessToken: this._accessToken.token.value,
            refreshToken: this._refreshToken.token.value,
        };
    }
}

export class LoginResponseDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
