import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
} 