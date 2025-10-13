import { EMAIL_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';

/*
 * Domain representation of Email
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class Email {
    private constructor(private readonly _value: string) {}

    static create(value: string) {
        const normalized = validateByRegex(value, EMAIL_REGEX, 'email');
        return new Email(normalized);
    }

    get value(): string {
        return this._value;
    }
}
