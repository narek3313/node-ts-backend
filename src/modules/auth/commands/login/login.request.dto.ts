import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/libs/regex';

export class LoginRequestDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: 'StrongPass123!',
        description: 'User password matching PASSWORD_REGEX',
    })
    @Matches(PASSWORD_REGEX, { message: 'Invalid password format' })
    readonly password: string;
}
