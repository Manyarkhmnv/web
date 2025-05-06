import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Bonus } from './bonus.type';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field(() => ID)
  bonusId: number;

  @Field(() => Bonus, { nullable: true })
  bonus?: Bonus;
} 