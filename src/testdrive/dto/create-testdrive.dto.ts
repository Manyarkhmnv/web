import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsDateString,
    IsOptional,
    IsInt,
    Min, IsEmail, Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestdriveDto {
    @ApiProperty({ example: 'Фортепиано', description: 'Тип инструмента' })
    @IsString()
    instrumentType: string;

    @ApiProperty({ example: '2025-05-01T14:00:00.000Z', description: 'Дата и время тест-драйва' })
    @Type(() => String)
    @IsDateString()
    date: string;

    @ApiProperty({ example: '14:00', description: 'Время тест-драйва' })
    @Type(() => String)
    @IsString()
    time: string;

    @ApiProperty({ example: 'Иван Иванов', description: 'Имя клиента' })
    @IsString()
    name: string;

    @IsOptional()
    @ApiPropertyOptional({ example: 'example@mail.com', description: 'Email клиента' })
    @IsEmail()
    email?: string;

    @ApiProperty({ example: '+79998887766', description: 'Телефон клиента' })
    @IsString()
    phone: string;


    @ApiPropertyOptional({ example: 'Хочу попробовать Yamaha C7', description: 'Комментарии' })
    @IsOptional()
    @IsString()
    comments?: string;

    @ApiPropertyOptional({ example: 1, description: 'ID пользователя (если авторизован)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId?: number;
}
