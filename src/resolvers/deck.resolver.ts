import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { PrismaService } from '../services/prisma.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    return await this.prismaService.query.decks({
      where: { userId: user.uid },
    });
  }
}
