import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDateString, IsOptional, IsInt, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UpdateTestdriveInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  instrumentType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => String)
  @IsDateString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => String)
  @IsString()
  time?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

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