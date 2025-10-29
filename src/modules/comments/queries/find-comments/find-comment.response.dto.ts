import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsUUID,
    IsString,
    IsOptional,
    IsDateString,
    IsInt,
    Min,
    IsArray,
    ValidateNested,
} from 'class-validator';

export class FindCommentResponseDto {
    @ApiProperty({ example: '770e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4')
    id: string;

    @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4')
    postId: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4')
    authorId: string;

    @ApiProperty({ example: 'This is a comment.' })
    @IsString()
    content: string;

    @ApiProperty({ type: Date, example: '2025-10-23T09:18:58.748Z' })
    @IsDateString()
    createdAt: Date;

    @ApiProperty({ type: Date, example: '2025-10-23T10:18:58.748Z' })
    @IsDateString()
    updatedAt: Date;

    @ApiProperty({ type: Date, nullable: true, example: null })
    @IsOptional()
    @IsDateString()
    deletedAt?: Date | null;

    @ApiProperty({ example: 0 })
    @IsInt()
    @Min(0)
    likesCount: number;

    @ApiProperty({ example: 0 })
    @IsInt()
    @Min(0)
    repliesCount: number;

    @ApiProperty({ example: '880e8400-e29b-41d4-a716-446655440000', nullable: true })
    @IsOptional()
    @IsUUID('4')
    parentId?: string | null;

    constructor(props: {
        id: string;
        postId: string;
        authorId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
        likesCount: number;
        repliesCount: number;
        parentId?: string | null;
    }) {
        this.id = props.id;
        this.postId = props.postId;
        this.authorId = props.authorId;
        this.content = props.content;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
        this.likesCount = props.likesCount;
        this.repliesCount = props.repliesCount;
        this.parentId = props.parentId;
    }
}

export class FindPaginatedCommentsResponseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    @Min(1)
    limit: number;

    @ApiProperty({ example: 42 })
    @IsInt()
    @Min(0)
    total: number;

    @ApiProperty({ type: [FindCommentResponseDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindCommentResponseDto)
    data: FindCommentResponseDto[];

    constructor(data: Partial<FindPaginatedCommentsResponseDto>) {
        Object.assign(this, data);
    }
}
