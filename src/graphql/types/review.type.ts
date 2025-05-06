import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from './product.type';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  text: string;

  @Field()
  rating: number;

  @Field(() => ID)
  productId: number;

  @Field(() => ID, { nullable: true })
  userId?: number;

  @Field(() => Product, { nullable: true })
  product?: Product;
} 