import { IsUrl, Length, Matches } from 'class-validator';
import { MEDIA_URL_REGEX } from 'src/libs/regex';

export class UpdateAvatarDto {
    @IsUrl()
    /* hardening the validation because isUrl() method has vulnerabilities (until it gets fixed) */
    @Matches(MEDIA_URL_REGEX, { message: 'Wrong avatar URL format' })
    @Length(10, 2048)
    readonly avatar: string;
}
