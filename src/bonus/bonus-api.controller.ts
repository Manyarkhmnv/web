import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    NotFoundException,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { BonusService } from './bonus.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Bonus')
@Controller('api/bonus')
export class BonusApiController {
    constructor(private readonly bonusService: BonusService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Создание бонуса' })
    @ApiResponse({ status: 201, description: 'Бонус создан' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    create(@Body() dto: CreateBonusDto) {
        return this.bonusService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список бонусов с пагинацией' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Список бонусов' })
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10
    ) {
        const data = await this.bonusService.findAllPaginated(page, limit);

        const totalPages = Math.ceil(data.total / limit);
        const nextPage = page < totalPages ? `/api/bonus?page=${page + 1}&limit=${limit}` : null;
        const prevPage = page > 1 ? `/api/bonus?page=${page - 1}&limit=${limit}` : null;

        return {
            data: data.items,
            meta: {
                total: data.total,
                page,
                limit,
                nextPage,
                prevPage
            }
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить бонус по ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Найденный бонус' })
    @ApiResponse({ status: 404, description: 'Бонус не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const bonus = await this.bonusService.findOne(id);
        if (!bonus) {
            throw new NotFoundException('Бонус не найден');
        }
        return bonus;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Обновить бонус' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Бонус обновлён' })
    @ApiResponse({ status: 404, description: 'Бонус не найден' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBonusDto) {
        const bonus = await this.bonusService.findOne(id);
        if (!bonus) {
            throw new NotFoundException('Бонус не найден');
        }
        return this.bonusService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить бонус' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 204, description: 'Бонус удалён' })
    @ApiResponse({ status: 404, description: 'Бонус не найден' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const bonus = await this.bonusService.findOne(id);
        if (!bonus) {
            throw new NotFoundException('Бонус не найден');
        }
        await this.bonusService.remove(id);
    }
}
