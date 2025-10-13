import { MEDIA_URL_REGEX } from 'src/libs/regex';
import { validateByRegex } from 'src/libs/utils/validate-string';

export class MediaURL {
    private constructor(private readonly _value: string) {}

    public static create(value: string): MediaURL {
        const normalized = validateByRegex(value, MEDIA_URL_REGEX, 'avatar-url');

        return new MediaURL(normalized);
    }

    public static isValid(value: string): boolean {
        return MEDIA_URL_REGEX.test(value);
    }

    public equals(other: MediaURL): boolean {
        return this._value === other._value;
    }

    public isHostedOn(domain: string): boolean {
        try {
            const parsedUrl = new URL(this._value);
            return parsedUrl.hostname === domain;
        } catch {
            return false;
        }
    }

    public getHostname(): string | null {
        try {
            return new URL(this._value).hostname;
        } catch {
            return null;
        }
    }

    public toString(): string {
        return this._value;
    }

    public get value(): string {
        return this._value;
    }
}
