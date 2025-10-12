import { PASSWORD_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';

/*
 * Domain representation of Password
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class Password {
    private constructor(private readonly _value: string) {}

    static create(value: string) {
        const normalized = validateByRegex(value, PASSWORD_REGEX, 'password');
        return new Password(normalized);
    }

    get value(): string {
        return this._value;
    }
}
