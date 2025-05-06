import { Type } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Min, IsOptional} from "class-validator";
import { Multer } from 'multer';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    image?: Express.Multer.File;
}
