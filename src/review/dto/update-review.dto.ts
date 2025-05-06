import {IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class UpdateReviewDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @Type(() => Number)
    @IsInt()
    productId: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    userId?: number;
}
