import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Response } from 'express';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @Render('reviews')
  async showReviews() {
    const reviews = await this.reviewService.findAll();

    const enhancedReviews = reviews.map((review: any) => ({
      ...review,
      productName: review.product?.name || 'Неизвестно',
    }));

    return { reviews: enhancedReviews };
  }

  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto, @Res() res: Response) {
    const createdReview = await this.reviewService.create(createReviewDto);
    return res.redirect('/reviews');
  }

  @Get(':id/edit')
  @Render('edit-review')
  async renderEditPage(@Param('id') id: string) {
    const review = await this.reviewService.findOne(+id);
    if (!review) {
      throw new HttpException('Отзыв не найден', HttpStatus.NOT_FOUND);
    }
    return { review };
  }

  @Post(':id')
  async handleEditOrDelete(
      @Param('id') id: string,
      @Body() body: any,
      @Res() res: Response,
  ) {
    const reviewId = parseInt(id, 10);

    if (body._method === 'PATCH') {
      const { _method, ...cleanBody } = body;
      await this.reviewService.update(reviewId, cleanBody);
      return res.redirect(`/reviews/${reviewId}`);
    }

    if (body._method === 'DELETE') {
      await this.reviewService.remove(reviewId);
      return res.redirect(`/reviews`);
    }

    return res.status(400).send('Метод не поддерживается');
  }
  @Get(':id')
  @Render('review-detail')
  async showReview(@Param('id') id: string) {
    const review = await this.reviewService.findOne(+id);
    if (!review) {
      throw new HttpException('Отзыв не найден', HttpStatus.NOT_FOUND);
    }
    return { review };
  }

  @Get('product/:productId')
  @Render('reviews')
  async showReviewsForProduct(@Param('productId') productId: string) {
    const reviews = await this.reviewService.findByProductId(+productId);
    const product = await this.reviewService.getProductById(+productId);

    if (!product) {
      throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
    }

    const enhancedReviews = reviews.map((review: any) => ({
      ...review,
      productName: product.name,
    }));

    return {
      reviews: enhancedReviews,
      productId: product.id,
      productName: product.name,
    };
  }
}
