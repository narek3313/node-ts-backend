import { IsString, IsNotEmpty } from 'class-validator';
import { RefreshToken } from '../../refresh-token.entity';
import { AccessToken } from '../../domain/value-objects/access-token.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class LoginResponse {
    constructor(
        private readonly _refreshToken: RefreshToken,
        private readonly _accessToken: AccessToken,
        private readonly _sessionId: Uuid4,
    ) {}

    static create(rt: RefreshToken, at: AccessToken, sId: Uuid4) {
        return new LoginResponse(rt, at, sId);
    }

    toObject() {
        return {
            accessToken: this._accessToken.token.value,
            refreshToken: this._refreshToken.token.value,
            sessionId: this._sessionId.value,
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
