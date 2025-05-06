import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateReviewInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  text: string;

  @Field()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @Type(() => Number)
  @IsInt()
  productId: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
} 