// src/review/review-api.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewApiController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    @ApiOperation({ summary: 'Создать отзыв' })
    @ApiResponse({ status: 201, description: 'Отзыв создан' })
    async create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все отзывы' })
    async findAll() {
        return this.reviewService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить отзыв по ID' })
    @ApiNotFoundResponse({ description: 'Отзыв не найден' })
    async findOne(@Param('id') id: string) {
        const review = await this.reviewService.findOne(+id);
        if (!review) {
            throw new HttpException('Отзыв не найден', HttpStatus.NOT_FOUND);
        }
        return review;
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Получить отзывы по товару' })
    @ApiNotFoundResponse({ description: 'Товар не найден' })
    async findByProductId(@Param('productId') productId: string) {
        const product = await this.reviewService.getProductById(+productId);
        if (!product) {
            throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
        }
        return this.reviewService.findByProductId(+productId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить отзыв' })
    async update(
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
    ) {
        return this.reviewService.update(+id, updateReviewDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить отзыв' })
    async remove(@Param('id') id: string) {
        return this.reviewService.remove(+id);
    }
}
