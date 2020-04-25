import { Resolver, Query, Args } from '@nestjs/graphql';
import { PrismaService } from '../services/prisma.service';

@Resolver()
export class DeckResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  decks(@Args() args) {
    return this.prismaService.query.decks(args);
  }
}
