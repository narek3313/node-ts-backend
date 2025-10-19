import { MinLength, MaxLength, Matches } from 'class-validator';
import { USERNAME_REGEX } from 'src/libs/regex';

export class UpdateUsernameDto {
    @MinLength(3)
    @MaxLength(30)
    @Matches(USERNAME_REGEX, { message: 'Wrong username format' })
    readonly username: string;
}
