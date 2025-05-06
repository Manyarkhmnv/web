import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { name, email, text, rating, productId, userId } = createReviewDto;

    const numericProductId = Number(productId);
    const numericUserId = userId ? Number(userId) : null;
    const numericRating = Number(rating);

    if (isNaN(numericProductId)) {
      throw new Error('Некорректный productId');
    }

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new Error('Некорректная оценка (rating)');
    }

    return this.prisma.review.create({
      data: {
        name,
        email,
        text,
        rating: numericRating,
        userId: numericUserId,
        productId: numericProductId,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: number) {
    return this.prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  async getProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: {
        name: updateReviewDto.name,
        email: updateReviewDto.email,
        text: updateReviewDto.text,
        rating: parseInt(updateReviewDto.rating.toString(), 10),
        productId: parseInt(updateReviewDto.productId.toString(), 10),
        userId: updateReviewDto.userId ? parseInt(updateReviewDto.userId.toString(), 10) : null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.review.delete({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });
  }
}
