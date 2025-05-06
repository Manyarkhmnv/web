import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from '../graphql/types/review.type';
import { CreateReviewInput } from './graphql/create-review.input';
import { UpdateReviewInput } from './graphql/update-review.input';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review])
  async reviews(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { nullable: true })
  async review(@Args('id', { type: () => ID }) id: string): Promise<Review | null> {
    return this.reviewService.findOne(parseInt(id, 10));
  }

  @Query(() => [Review])
  async reviewsByProduct(@Args('productId', { type: () => ID }) productId: string): Promise<Review[]> {
    return this.reviewService.findByProductId(parseInt(productId, 10));
  }

  @Mutation(() => Review)
  async createReview(@Args('input') input: CreateReviewInput): Promise<Review> {
    return this.reviewService.create(input);
  }

  @Mutation(() => Review)
  async updateReview(
      @Args('id', { type: () => ID }) id: string,
      @Args('input') input: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewService.update(parseInt(id, 10), input);
  }

  @Mutation(() => Review)
  async deleteReview(@Args('id', { type: () => ID }) id: string): Promise<Review> {
    return this.reviewService.remove(parseInt(id, 10));
  }
} 