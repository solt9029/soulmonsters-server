import { DeckCard } from './../prisma/prisma.binding';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckCardService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByDeckId(deckId: string): Promise<DeckCard[]> {
    const query = `
    query($deckId: ID!) {
      deckCards(
        where: { deck: { id: $deckId } }
      ) {
        id count
        card {
          id name kind attribute type attack defence cost detail picture
        }
        deck {
          id userId name
        }
      }
    }
    `;
    const variables = { deckId };

    const result = await this.prismaService.request<{
      data: { deckCards: DeckCard[] };
    }>(query, variables);

    return result.data.deckCards;
  }

  async findByDeckIdAndCardId(
    deckId: string,
    cardId: string,
  ): Promise<DeckCard[]> {
    const query = `
    query($deckId: ID!, $cardId: ID!) {
      deckCards(
        where: { deck: { id: $deckId }, card: { id: $cardId } }
      ) {
        id count
        card {
          id name kind attribute type attack defence cost detail picture
        }
        deck {
          id userId name
        }
      }
    }
    `;
    const variables = { deckId, cardId };

    const result = await this.prismaService.request<{
      data: { deckCards: DeckCard[] };
    }>(query, variables);

    return result.data.deckCards;
  }

  async updateCountById(id: string, count: number): Promise<DeckCard> {
    return await this.prismaService.mutation.updateDeckCard({
      where: { id },
      data: { count },
    });
  }

  async create(deckId: string, cardId: string): Promise<DeckCard> {
    return await this.prismaService.mutation.createDeckCard({
      data: {
        deck: { connect: { id: deckId } },
        card: { connect: { id: cardId } },
      },
    });
  }
}
