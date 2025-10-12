import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';

/*
 * Domain representation of User-Agent
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class UserAgent {
    private constructor(private readonly val: string) {}

    public static create(val: string): UserAgent {
        if (!val || typeof val !== 'string' || val.length > 500) {
            throw new ArgumentInvalidException('Invalid user agent');
        }
        return new UserAgent(val);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: UserAgent): boolean {
        return this.val === other.val;
    }
}
