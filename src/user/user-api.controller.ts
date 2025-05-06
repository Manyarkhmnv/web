import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    ParseIntPipe,
    NotFoundException,
    UsePipes,
    ValidationPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/user')
export class UserApiController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Создать пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь создан' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации или пользователь с таким email уже существует' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список всех пользователей' })
    @ApiResponse({ status: 200, description: 'Список пользователей' })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Пользователь найден' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return user;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Обновить данные пользователя' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 204, description: 'Пользователь удалён' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        await this.userService.remove(id);
    }
}
