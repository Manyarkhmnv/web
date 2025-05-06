import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    ParseIntPipe,
    NotFoundException,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { TestdriveService } from './testdrive.service';
import { CreateTestdriveDto } from './dto/create-testdrive.dto';
import { UpdateTestdriveDto } from './dto/update-testdrive.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam
} from '@nestjs/swagger';

@ApiTags('Testdrive')
@Controller('api/testdrive')
export class TestdriveApiController {
    constructor(private readonly testdriveService: TestdriveService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Создать заявку на тест-драйв' })
    @ApiResponse({ status: 201, description: 'Заявка создана' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
    create(@Body() createTestdriveDto: CreateTestdriveDto) {
        return this.testdriveService.create(createTestdriveDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список заявок на тест-драйв' })
    @ApiResponse({ status: 200, description: 'Список заявок' })
    findAll() {
        return this.testdriveService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить заявку по ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Заявка найдена' })
    @ApiResponse({ status: 404, description: 'Заявка не найдена' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const testdrive = await this.testdriveService.findOne(id);
        if (!testdrive) {
            throw new NotFoundException('Заявка не найдена');
        }
        return testdrive;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Обновить заявку на тест-драйв' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Заявка обновлена' })
    @ApiResponse({ status: 404, description: 'Заявка не найдена' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTestdriveDto: UpdateTestdriveDto
    ) {
        const existing = await this.testdriveService.findOne(id);
        if (!existing) {
            throw new NotFoundException('Заявка не найдена');
        }
        return this.testdriveService.update(id, updateTestdriveDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить заявку на тест-драйв' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 204, description: 'Заявка удалена' })
    @ApiResponse({ status: 404, description: 'Заявка не найдена' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const existing = await this.testdriveService.findOne(id);
        if (!existing) {
            throw new NotFoundException('Заявка не найдена');
        }
        await this.testdriveService.remove(id);
    }
}
