import { IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDeckInputType {
  @IsNotEmpty()
  @MaxLength(64)
  @Field()
  name: string;
}
