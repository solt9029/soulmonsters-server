import { Deck } from './../graphql';
import { ValidatedDeckCreateInput } from '../inputs/validated.deck.create.input';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PrismaService } from '../services/prisma.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(returns => [Deck])
  async decks(@User() user: auth.DecodedIdToken) {
    return await this.prismaService.query.decks({
      where: { userId: user.uid },
    });
  }

  @Mutation(returns => Deck)
  async createDeck(
    @User() user: auth.DecodedIdToken,
    @Args('data') data: ValidatedDeckCreateInput,
  ) {
    return await this.prismaService.mutation.createDeck({
      data: {
        userId: user.uid,
        name: data.name,
      },
    });
  }
}
