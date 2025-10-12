import { randomUUID } from 'crypto';

/*
 * Class for UUIDV4 type across domain layer
 *
 * Many Id (i.e. sessionId, userId) value objects inherit from this base class
 *
 * This class enforces validation, eqaulity semantics across domain layer
 */
export class Uuid4 {
    private readonly _value: string;

    private constructor() {
        this._value = randomUUID();
    }

    public static create(): Uuid4 {
        return new Uuid4();
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
