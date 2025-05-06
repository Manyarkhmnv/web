import { IsEmail, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bonusPoints?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(['bronze', 'silver', 'gold'])
    bonusStatus?: 'bronze' | 'silver' | 'gold';
}
