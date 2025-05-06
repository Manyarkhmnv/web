import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;

  @Field()
  rating: number;

  @Field(() => ID)
  productId: number;

  @Field(() => ID)
  userId: number;
} 