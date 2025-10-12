import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class ExpiresAt {
    private constructor(private readonly value: DateTime) {}

    public static create(value: DateTime): ExpiresAt {
        if (!(value instanceof DateTime) || isNaN(value.toMillis())) {
            throw new ArgumentInvalidException('ExpiresAt must be a valid date');
        }
        if (value.toMillis() <= DateTime.now().toMillis()) {
            throw new ArgumentInvalidException('ExpiresAt must be in the future');
        }
        return new ExpiresAt(value);
    }

    // Optional `now` parameter allows testing against a specific time
    public isExpired(now?: DateTime): boolean {
        return now
            ? this.value.toMillis() < now.toMillis()
            : this.value.toMillis() < DateTime.now().toMillis();
    }

    public getValue(): DateTime {
        return this.value;
    }
}
