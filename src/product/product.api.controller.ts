import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    ParseIntPipe,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

@ApiTags('Product')
@Controller('api/product')
@UseInterceptors(EtagInterceptor)
export class ProductApiController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @ApiOperation({ summary: 'Создать товар' })
    @ApiResponse({ status: 201, description: 'Товар успешно создан' })
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('all-products')
    @CacheTTL(5)
    @ApiOperation({ summary: 'Получить список всех товаров' })
    async findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    @CacheKey('product')
    @CacheTTL(5)
    @ApiOperation({ summary: 'Получить один товар по ID' })
    @ApiResponse({ status: 200, description: 'Информация о товаре' })
    @ApiResponse({ status: 404, description: 'Товар не найден' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const product = await this.productService.findOne(id.toString());
        if (!product) {
            throw new NotFoundException('Товар не найден');
        }
        return product;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить товар по ID' })
    @ApiResponse({ status: 200, description: 'Товар обновлён' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить товар по ID' })
    @ApiResponse({ status: 200, description: 'Товар удалён' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
