import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Bonus {
  @Field(() => ID)
  id: number;

  @Field()
  points: number;

  @Field()
  status: string;

  @Field(() => ID)
  userId: number;
} 