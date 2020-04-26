import { DeckCard } from './../prisma/prisma.binding';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { PrismaService } from '../services/prisma.service';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async deckCards(
    @Args('deckId') deckId: string,
    @User() user: auth.DecodedIdToken,
  ) {
    const query = `
    query($userId: String!, $deckId: ID!) {
      deckCards(
        where: { deck: { userId: $userId, id: $deckId } }
      ) {
        id
        count
        card {
          id
        }
      }
    }
    `;
    const variables = {
      userId: user.uid,
      deckId: deckId,
    };

    const result = await this.prismaService.request<{
      data: { deckCards: DeckCard[] };
    }>(query, variables);

    return result.data.deckCards;
  }
}
