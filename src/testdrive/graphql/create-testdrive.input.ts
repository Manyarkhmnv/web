import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDateString, IsOptional, IsInt, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateTestdriveInput {
  @Field()
  @IsString()
  instrumentType: string;

  @Field()
  @Type(() => String)
  @IsDateString()
  date: string;

  @Field()
  @Type(() => String)
  @IsString()
  time: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comments?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;
} 