import { DeckCard } from './../prisma/prisma.binding';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckCardService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByDeckIdAndUserId(
    deckId: string,
    userId: string,
  ): Promise<DeckCard[]> {
    const query = `
    query($userId: String!, $deckId: ID!) {
      deckCards(
        where: { deck: { userId: $userId, id: $deckId } }
      ) {
        id
        count
        card {
          id
          name
          kind
          attribute
          type
          attack
          defence
          cost
          detail
          picture
        }
        deck {
          id
          userId
          name
        }
      }
    }
    `;
    const variables = {
      userId: userId,
      deckId: deckId,
    };

    const result = await this.prismaService.request<{
      data: { deckCards: DeckCard[] };
    }>(query, variables);

    return result.data.deckCards;
  }
}
