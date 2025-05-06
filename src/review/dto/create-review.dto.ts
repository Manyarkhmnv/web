import { IsString, IsEmail, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    productId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    userId?: number;
}
