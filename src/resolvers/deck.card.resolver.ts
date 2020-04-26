import { DeckCardService } from './../services/deck.card.service';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  constructor(private readonly deckCardService: DeckCardService) {}

  @Query()
  async deckCards(
    @Args('deckId') deckId: string,
    @User() user: auth.DecodedIdToken,
  ) {
    return this.deckCardService.findByDeckIdAndUserId(deckId, user.uid);
  }
}
