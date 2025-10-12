import {
    format,
    isBefore,
    isAfter,
    add,
    sub,
    startOfDay as dfStartOfDay,
    endOfDay as dfEndOfDay,
    differenceInDays as dfDifferenceInDays,
} from 'date-fns';
import { ArgumentInvalidException } from '../exceptions/exceptions';

export type Duration = { days?: number; hours?: number; minutes?: number; seconds?: number };

export class DateTime {
    private constructor(private readonly value: Date) {}

    /** Create a DateTime representing "now" */
    public static now(): DateTime {
        return new DateTime(new Date());
    }

    /** Create from existing Date object */
    public static fromDate(date: Date): DateTime {
        return new DateTime(new Date(date.getTime()));
    }

    /** Create from timestamp */
    public static fromMillis(ms: number): DateTime {
        return new DateTime(new Date(ms));
    }

    /** Create from ISO string */
    public static fromISO(isoString: string): DateTime {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) throw new ArgumentInvalidException('Invalid date');
        return new DateTime(date);
    }

    /** Compare */
    public isBefore(other: DateTime): boolean {
        return isBefore(this.value, other.value);
    }

    public isAfter(other: DateTime): boolean {
        return isAfter(this.value, other.value);
    }

    /** Add time */
    public add(d: Duration): DateTime {
        return new DateTime(
            add(this.value, {
                days: d.days ?? 0,
                hours: d.hours ?? 0,
                minutes: d.minutes ?? 0,
                seconds: d.seconds ?? 0,
            }),
        );
    }

    /** Subtract time */
    public sub(d: Duration): DateTime {
        return new DateTime(
            sub(this.value, {
                days: d.days ?? 0,
                hours: d.hours ?? 0,
                minutes: d.minutes ?? 0,
                seconds: d.seconds ?? 0,
            }),
        );
    }

    /** Format as ISO string */
    public toISO(): string {
        return this.value.toISOString();
    }

    /** Format using date-fns pattern */
    public format(pattern: string): string {
        return format(this.value, pattern);
    }

    /** Get raw Date object */
    public toDate(): Date {
        return new Date(this.value.getTime());
    }

    /** Get timestamp */
    public toMillis(): number {
        return this.value.getTime();
    }

    /** Compare equality */
    public equals(other: DateTime): boolean {
        return this.value.getTime() === other.value.getTime();
    }

    /** Start of the day */
    public startOfDay(): DateTime {
        return new DateTime(dfStartOfDay(this.value));
    }

    /** End of the day */
    public endOfDay(): DateTime {
        return new DateTime(dfEndOfDay(this.value));
    }

    /** Difference in full days */
    public differenceInDays(other: DateTime): number {
        return dfDifferenceInDays(this.value, other.value);
    }

    /** Clone this DateTime */
    public clone(): DateTime {
        return new DateTime(new Date(this.value.getTime()));
    }
}
