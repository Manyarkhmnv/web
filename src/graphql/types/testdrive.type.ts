import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.type';

@ObjectType()
export class Testdrive {
  @Field(() => ID)
  id: number;

  @Field()
  instrumentType: string;

  @Field(() => Date)
  date: Date;

  @Field()
  time: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  comments?: string;

  @Field(() => ID, { nullable: true })
  userId?: number;

  @Field(() => User, { nullable: true })
  user?: User;
} 