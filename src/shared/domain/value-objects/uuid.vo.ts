import { randomUUID } from 'crypto';
import { UUID_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';

/*
 * Class for UUIDV4 type across domain layer
 *
 * Many Id (i.e. sessionId, userId) value objects inherit from this base class
 *
 * This class enforces validation, eqaulity semantics across domain layer
 */
export class Uuid4 {
    private readonly _value: string;

    private constructor(_id?: string) {
        if (_id) {
            const id = validateByRegex(_id, UUID_REGEX, 'uuidv4');
            this._value = id;
        } else {
            this._value = randomUUID();
        }
    }

    public static create(): Uuid4 {
        return new Uuid4();
    }

    public static from(id: string): Uuid4 {
        return new Uuid4(id);
    }

    public equals(other: Uuid4): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }

    public toJSON(): string {
        return this._value;
    }

    get value(): string {
        return this._value;
    }
}
