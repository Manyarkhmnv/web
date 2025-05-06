import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBonusDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    points: number;

    @ApiProperty()
    @IsEnum(['bronze', 'silver', 'gold'])
    status: 'bronze' | 'silver' | 'gold';

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    userId: number;
}
