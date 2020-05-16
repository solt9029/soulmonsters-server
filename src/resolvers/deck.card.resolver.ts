import { DeckCardService } from './../services/deck.card.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  constructor(private readonly deckCardService: DeckCardService) {}

  @Query()
  async deckCards(
    @User() user: auth.DecodedIdToken,
    @Args('deckId') deckId: string,
  ) {
    const deckCardEntities = await this.deckCardService.findByDeckId(deckId);

    if (
      deckCardEntities.length > 0 &&
      deckCardEntities[0].deck.userId !== user.uid
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return deckCardEntities;
  }
}
