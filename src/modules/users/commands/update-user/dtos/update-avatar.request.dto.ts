import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, Length, Matches } from 'class-validator';
import { AVATAR_URL_REGEX } from 'src/libs/regex';

export class UpdateAvatarDto {
    @ApiProperty({
        example: 'https://example.com/avatars/user123.png',
        description: 'URL of the new avatar image (10–2048 characters) matching MEDIA_URL_REGEX',
        minLength: 10,
        maxLength: 2048,
    })
    /* reinforcing url validation because isUrl method is not safe (until patched)*/
    @IsUrl()
    @Matches(AVATAR_URL_REGEX, { message: 'Wrong avatar URL format' })
    @Length(10, 2048)
    readonly avatar: string;
}
