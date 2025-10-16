import {
    ArrayMaxSize,
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import { MediaType } from 'src/libs/enums/post-media-type';

export class CreatePostRequestDto {
    @MaxLength(100)
    readonly title: string;

    @MaxLength(5000)
    readonly content: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly media?: CreatePostMediaDto[];

    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    readonly tags: string[];
}

export class CreatePostMediaDto {
    @IsUrl()
    readonly url: string;

    @IsEnum(MediaType)
    readonly type: MediaType;

    @IsNumber()
    readonly size: number; // size in bytes

    @ValidateIf((o: CreatePostMediaDto) => o.type === MediaType.VIDEO || o.type === MediaType.AUDIO)
    @IsNumber()
    readonly duration?: number; // only for video/audio
}
