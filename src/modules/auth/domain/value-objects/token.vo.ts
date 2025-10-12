import { JWT_TOKEN_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';

/*
 * Domain representation of JwtToken used for authentication, authorization,
 * session managment
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class JwtToken {
    private constructor(private readonly _value: string) {}

    static create(value: string): JwtToken {
        const normalized = value.trim();
        validateByRegex(normalized, JWT_TOKEN_REGEX, 'jwt-token');
        return new JwtToken(normalized);
    }

    get value(): string {
        return this._value;
    }

    public equals(other: JwtToken): boolean {
        return this._value === other._value;
    }
}
