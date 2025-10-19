import { JwtService } from '@nestjs/jwt';
import { JWT_TOKEN_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';
import { JwtPayload } from '../../jwt/jwt-payload.interface';
import { ExpiresAt } from 'src/shared/domain/value-objects/expires-at.vo';
import { DateTime } from 'src/libs/utils/date-time';

/*
 * Domain representation of JwtToken used for authentication, authorization,
 * session managment
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class JwtToken {
    private constructor(
        private readonly _value: string,
        private readonly _expiresAt: ExpiresAt,
    ) {}

    static create(value: string, expires?: '1h' | '7d' | Date): JwtToken {
        const normalized = value.trim();
        validateByRegex(normalized, JWT_TOKEN_REGEX, 'jwt-token');

        let expiresAt: ExpiresAt;

        if (expires instanceof Date) {
            // restoring persisted token
            expiresAt = ExpiresAt.from(expires);
        } else {
            // normal flow: compute expiration based on duration string
            const hours = expires === '1h' ? 1 : 168;
            expiresAt = ExpiresAt.from(DateTime.now().add({ hours }));
        }

        return new JwtToken(normalized, expiresAt);
    }

    static createFromPayload(
        jwtService: JwtService,
        payload: JwtPayload,
        /* Very simple method to assign custom expiresIn. Might be changed in the future to be
         * more flexible
         */
        expiresIn: '7d' | '1h',
    ): JwtToken {
        const token = jwtService.sign(payload, { expiresIn });
        const hours = expiresIn === '1h' ? 1 : 168;

        const expires = ExpiresAt.from(DateTime.now().add({ hours }));
        return new JwtToken(token, expires);
    }

    get value(): string {
        return this._value;
    }

    get expiresAt(): ExpiresAt {
        return this._expiresAt;
    }

    public equals(other: JwtToken): boolean {
        return this._value === other._value;
    }
}
