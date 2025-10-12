import { DateTime } from 'src/libs/utils/date-time';

export class RevokedAt {
    private constructor(private readonly value: DateTime | null) {}

    static none(): RevokedAt {
        return new RevokedAt(null);
    }

    static now(): RevokedAt {
        return new RevokedAt(DateTime.now());
    }

    static at(date: DateTime): RevokedAt {
        return new RevokedAt(date);
    }

    isRevoked(): boolean {
        return this.value !== null;
    }

    get valueOrNull(): DateTime | null {
        return this.value;
    }

    get ValueOrThrow(): DateTime {
        if (!this.value) throw new Error('Token not revoked');
        return this.value;
    }
}
