import { ArgumentInvalidException } from '../exceptions/exceptions';

/*
 * This function is used inside username, email, password, etc value-objects to
 * validate if the given value is valid.
 * Returns trimmed, validated string if the format is valid.
 * Can take 1 or 2 regexes
 * */
export function validateByRegex(val: string, regex: RegExp[] | RegExp, fieldName: string): string {
    val = val.trim();
    if (Array.isArray(regex)) {
        if (!regex[0].test(val) && !regex[1].test(val)) {
            throw new ArgumentInvalidException(`Invalid ${fieldName} format`);
        }
    } else {
        if (!regex.test(val)) {
            throw new ArgumentInvalidException(`Invalid ${fieldName} format`);
        }
    }

    return val;
}
