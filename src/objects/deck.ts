import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Deck {
  @Field(type => ID)
  id: number;

  @Field()
  userId: string;

  @Field()
  name: string;
}
