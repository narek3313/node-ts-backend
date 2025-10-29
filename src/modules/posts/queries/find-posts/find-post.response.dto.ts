import { ApiProperty } from '@nestjs/swagger';
import { PostStatusEnum } from '@prisma/client';
import {
    IsUUID,
    IsInt,
    Min,
    IsArray,
    IsOptional,
    IsString,
    IsEnum,
    IsDateString,
    ValidateNested,
    IsUrl,
    IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaItemDto } from '../../commands/update-post/dtos/update-media.request.dto';
import { FindCommentResponseDto } from 'src/modules/comments/queries/find-comments/find-comment.response.dto';
import { MediaType } from 'src/libs/enums/post-media-type';

export class MediaItemResponseDto {
    @IsString()
    @IsUrl()
    url: string;

    @IsEnum(MediaType)
    type: MediaType;

    @IsNumber()
    size: number;

    @IsOptional()
    @IsNumber()
    duration?: number;

    constructor(data: Partial<MediaItemResponseDto>) {
        Object.assign(this, data);
    }
}

export class FindPostResponseDto {
    @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4')
    id: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4')
    authorId: string;

    @ApiProperty({ example: 10 })
    @IsInt()
    @Min(0)
    likesCount: number;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    viewsCount: number;

    @ApiProperty({ example: 5 })
    @IsInt()
    @Min(0)
    commentsCount: number;

    @ApiProperty({ enum: PostStatusEnum, example: PostStatusEnum.Draft })
    @IsEnum(PostStatusEnum)
    status: PostStatusEnum;

    @ApiProperty({ type: [String], example: ['nestjs', 'typescript'] })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({ type: Date, example: '2025-10-23T09:18:58.748Z' })
    @IsDateString()
    createdAt: Date;

    @ApiProperty({ type: Date, example: '2025-10-23T09:18:58.748Z' })
    @IsDateString()
    updatedAt: Date;

    @ApiProperty({ type: Date, nullable: true, example: null })
    @IsOptional()
    @IsDateString()
    deletedAt?: Date | null;

    @ApiProperty({ example: 'My first post' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'This is the post content.' })
    @IsString()
    content: string;

    @ApiProperty({ type: [MediaItemDto], nullable: true })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MediaItemDto)
    media?: MediaItemDto[];

    @ApiProperty({ type: [FindCommentResponseDto], nullable: true })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindCommentResponseDto)
    comments?: FindCommentResponseDto[];

    constructor(data: Partial<FindPostResponseDto>) {
        Object.assign(this, data);
    }
}

export class FindPaginatedPostResponseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    @Min(1)
    limit: number;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    total: number;

    @ApiProperty({ type: [FindPostResponseDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindPostResponseDto)
    data: FindPostResponseDto[];

    constructor(data: Partial<FindPaginatedPostResponseDto>) {
        Object.assign(this, data);
    }
}
