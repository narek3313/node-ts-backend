import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class UpdatedAt {
    private constructor(private readonly _value: DateTime) {}

    public static now(): UpdatedAt {
        return new UpdatedAt(DateTime.now());
    }

    public static from(value: DateTime | Date): UpdatedAt {
        if (value instanceof DateTime) {
            if (isNaN(value.toMillis())) {
                throw new ArgumentInvalidException('Invalid UpdatedAt timestamp');
            }
        } else if (!(value instanceof Date)) {
            throw new ArgumentInvalidException('Invalid UpdatedAt timestamp');
        }

        if (value instanceof Date) {
            return new UpdatedAt(DateTime.fromDate(value));
        } else {
            return new UpdatedAt(value);
        }
    }

    public getValue(): DateTime {
        return this._value;
    }

    public equals(other: UpdatedAt): boolean {
        if (this._value instanceof DateTime && other.value instanceof DateTime) {
            return this._value.toMillis() === other.value.toMillis();
        }
        if (this._value instanceof Date && other.value instanceof Date) {
            return this._value.getTime() === other.value.getTime();
        }
        return false;
    }

    get value(): DateTime {
        return this._value;
    }
}
