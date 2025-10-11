import { ArgumentInvalidException } from '../exceptions/exceptions';

/*
 * This function is used inside username, email, password, etc value-objects to
 * validate if the given value is valid.
 * Returns trimmed, validated string if the format is valid.
 * */
export function validateByRegex(val: string, regex: RegExp, fieldName: string): string {
    val = val.trim();
    if (!regex.test(val)) {
        throw new ArgumentInvalidException(`Invalid ${fieldName} format`);
    }
    return val;
}
