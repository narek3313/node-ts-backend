import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class UpdatedAt {
    private constructor(private readonly _value: DateTime) {}

    public static now(): UpdatedAt {
        return new UpdatedAt(DateTime.now());
    }

    public static from(value: DateTime | Date): UpdatedAt {
        if (!(value instanceof DateTime) || !(value instanceof Date) || isNaN(value.toMillis())) {
            throw new ArgumentInvalidException('Invalid UpdatedAt timestamp');
        }

        return new UpdatedAt(value);
    }

    public getValue(): DateTime {
        return this._value;
    }

    public equals(other: UpdatedAt): boolean {
        return this._value === other.value;
    }

    get value(): DateTime {
        return this._value;
    }
}
