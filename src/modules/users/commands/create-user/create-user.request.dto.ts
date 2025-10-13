import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_REGEX, USERNAME_REGEX } from 'src/libs/regex';

export class CreateUserRequestDto {
    @IsEmail()
    @MaxLength(320)
    @MinLength(5)
    readonly email: string;

    @MaxLength(30)
    @MinLength(3)
    @Matches(USERNAME_REGEX)
    readonly username: string;

    @MaxLength(64)
    @MinLength(8)
    @Matches(PASSWORD_REGEX)
    readonly password: string;
}
