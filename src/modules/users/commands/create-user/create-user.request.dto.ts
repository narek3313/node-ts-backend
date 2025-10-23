import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_REGEX, USERNAME_REGEX } from 'src/libs/regex';

export class CreateUserRequestDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Valid email address of the user (5–320 characters)',
        maxLength: 320,
        minLength: 5,
    })
    @IsEmail()
    @MaxLength(320)
    @MinLength(5)
    readonly email: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Username (3–30 characters) matching USERNAME_REGEX',
        maxLength: 30,
        minLength: 3,
    })
    @MaxLength(30)
    @MinLength(3)
    @Matches(USERNAME_REGEX, { message: 'Wrong username format' })
    readonly username: string;

    @ApiProperty({
        example: 'StrongPass123!',
        description: 'Password (8–64 characters) matching PASSWORD_REGEX',
        maxLength: 64,
        minLength: 8,
    })
    @MaxLength(64)
    @MinLength(8)
    @Matches(PASSWORD_REGEX, { message: 'Wrong password format' })
    readonly password: string;
}
