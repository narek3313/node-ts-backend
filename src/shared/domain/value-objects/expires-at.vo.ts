import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { DateTime } from 'src/libs/utils/date-time';

export class ExpiresAt {
    private constructor(private readonly _value: DateTime) {}

    public static from(value: DateTime | Date): ExpiresAt {
        if (value instanceof DateTime) {
            if (isNaN(value.toMillis())) {
                throw new ArgumentInvalidException('Invalid ExpiresAt timestamp');
            }
        } else if (!(value instanceof Date)) {
            throw new ArgumentInvalidException('Invalid ExpiresAt timestamp');
        }

        if (value instanceof Date) {
            return new ExpiresAt(DateTime.fromDate(value));
        } else {
            return new ExpiresAt(value);
        }
    }

    // Optional `now` parameter allows testing against a specific time
    public isExpired(now?: DateTime): boolean {
        return now
            ? this.value.toMillis() < now.toMillis()
            : this.value.toMillis() < DateTime.now().toMillis();
    }

    get value(): DateTime {
        return this._value;
    }
}
