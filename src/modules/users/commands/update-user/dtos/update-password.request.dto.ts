import { MinLength, MaxLength, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/libs/regex';

export class UpdatePasswordDto {
    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX)
    readonly newPassword: string;

    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX)
    readonly oldPassword: string;
}
