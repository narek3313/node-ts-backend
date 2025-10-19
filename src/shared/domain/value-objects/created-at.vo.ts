import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class CreatedAt {
    private constructor(private readonly val: DateTime) {}

    public static now(): CreatedAt {
        return new CreatedAt(DateTime.now());
    }

    // Create CreatedAt value object with existing DateTime object
    public static from(value: DateTime | Date): CreatedAt {
        if (value instanceof DateTime) {
            if (isNaN(value.toMillis())) {
                throw new ArgumentInvalidException('Invalid CreatedAt timestamp');
            }
        } else if (!(value instanceof Date)) {
            throw new ArgumentInvalidException('Invalid CreatedAt timestamp');
        }

        if (value instanceof Date) {
            return new CreatedAt(DateTime.fromDate(value));
        } else {
            return new CreatedAt(value);
        }
    }

    get value(): DateTime {
        return this.val;
    }

    public equals(other: CreatedAt): boolean {
        return this.val.toMillis() === other.val.toMillis();
    }
}
