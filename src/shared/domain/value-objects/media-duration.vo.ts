import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';

export class MediaDuration {
    private constructor(private readonly seconds: number) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            throw new ArgumentInvalidException(
                `Duration must be a non-negative number of seconds, got: ${seconds}`,
            );
        }
    }

    public static fromSeconds(seconds: number): MediaDuration {
        return new MediaDuration(seconds);
    }

    public static fromMinutes(minutes: number): MediaDuration {
        return new MediaDuration(minutes * 60);
    }

    public static fromHours(hours: number): MediaDuration {
        return new MediaDuration(hours * 3600);
    }

    public getSeconds(): number {
        return this.seconds;
    }

    public getMinutes(): number {
        return this.seconds / 60;
    }

    public getHours(): number {
        return this.seconds / 3600;
    }

    public equals(other: MediaDuration): boolean {
        return this.seconds === other.seconds;
    }

    public toString(): string {
        return `${this.seconds} seconds`;
    }

    get value(): number {
        return this.seconds;
    }
}
