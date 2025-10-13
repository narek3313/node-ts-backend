import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class CreatedAt {
    private constructor(private readonly val: DateTime) {}

    public static now(): CreatedAt {
        return new CreatedAt(DateTime.now());
    }

    // Create CreatedAt value object with existing DateTime object
    public static from(val: DateTime | Date): CreatedAt {
        if (!(val instanceof DateTime) || !(val instanceof Date) || isNaN(val.toMillis())) {
            throw new ArgumentInvalidException('Invalid createdAt timestamp');
        }

        if (val.toMillis() > DateTime.now().toMillis()) {
            throw new ArgumentInvalidException('CreatedAt cannot be in the future');
        }

        return new CreatedAt(val);
    }

    get value(): DateTime {
        return this.val;
    }

    public equals(other: CreatedAt): boolean {
        return this.val.toMillis() === other.val.toMillis();
    }
}
