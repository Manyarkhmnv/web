// update-bonus.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBonusDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    points: number;

    @IsString()
    status: 'bronze' | 'silver' | 'gold';

    @IsOptional()
    @IsInt()
    userId?: number;
}
