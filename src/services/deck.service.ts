import { Deck } from './../graphql/index';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string): Promise<Deck[]> {
    return await this.prismaService.query.decks({
      where: { userId },
    });
  }

  async createDeck(userId: string, name: string): Promise<Deck> {
    return this.prismaService.mutation.createDeck({
      data: { userId, name },
    });
  }

  async findById(id: string): Promise<Deck | null> {
    return await this.prismaService.query.deck({ where: { id } });
  }
}
