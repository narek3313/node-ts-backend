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
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from 'src/libs/enums/post-media-type';

export class CreatePostMediaItemDto {
    @IsUrl()
    readonly url: string;

    @IsEnum(MediaType)
    readonly type: MediaType;

    @IsNumber()
    readonly size: number;

    @ValidateIf(
        (o: CreatePostMediaItemDto) => o.type === MediaType.VIDEO || o.type === MediaType.AUDIO,
    )
    @IsNumber()
    readonly duration?: number;
}

export class CreatePostMediaDto {
    @IsArray()
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => CreatePostMediaItemDto)
    readonly items: CreatePostMediaItemDto[];
}

export class CreatePostRequestDto {
    @MaxLength(100)
    readonly title: string;

    @MaxLength(5000)
    readonly content: string;

    @ValidateNested()
    @Type(() => CreatePostMediaDto)
    readonly media: CreatePostMediaDto;

    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    readonly tags: string[];
}
