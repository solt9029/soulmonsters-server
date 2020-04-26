import { Resolver, Query } from '@nestjs/graphql';
import { PrismaService } from '../services/prisma.service';

@Resolver()
export class CardResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async cards() {
    return await this.prismaService.query.cards({});
  }
}
