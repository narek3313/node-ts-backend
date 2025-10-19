import { IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/libs/regex';

export class LoginRequestDto {
    @IsEmail()
    readonly email: string;
    @Matches(PASSWORD_REGEX, { message: 'Invalid password format' })
    readonly password: string;
}
