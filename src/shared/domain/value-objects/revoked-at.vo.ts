import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class RevokedAt {
    private constructor(private readonly _value: DateTime | null) {}

    static none(): RevokedAt {
        return new RevokedAt(null);
    }

    static now(): RevokedAt {
        return new RevokedAt(DateTime.now());
    }

    static at(value: DateTime | Date): RevokedAt {
        let dt: DateTime;

        if (value instanceof DateTime) {
            dt = value;
        } else if (value instanceof Date) {
            dt = DateTime.fromDate(value);
        } else {
            throw new ArgumentInvalidException('Invalid RevokedAt timestamp');
        }

        if (isNaN(dt.toMillis())) {
            throw new ArgumentInvalidException('Invalid RevokedAt timestamp');
        }

        return new RevokedAt(dt);
    }

    isRevoked(): boolean {
        return this._value !== null;
    }

    get valueOrNull(): DateTime | null {
        return this._value;
    }

    get valueOrThrow(): DateTime {
        if (!this._value) throw new Error('Token not revoked');
        return this._value;
    }
}
