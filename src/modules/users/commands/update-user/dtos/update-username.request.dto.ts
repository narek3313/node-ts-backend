import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, Matches } from 'class-validator';
import { USERNAME_REGEX } from 'src/libs/regex';

export class UpdateUsernameDto {
    @ApiProperty({
        example: 'new_username',
        description: 'New username (3–30 characters) matching USERNAME_REGEX',
        minLength: 3,
        maxLength: 30,
    })
    @MinLength(3)
    @MaxLength(30)
    @Matches(USERNAME_REGEX, { message: 'Wrong username format' })
    readonly username: string;
}
