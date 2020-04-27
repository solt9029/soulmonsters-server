import { DeckService } from './../services/deck.service';
import { ValidatedDeckCreateInput } from '../inputs/validated.deck.create.input';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly deckService: DeckService) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    return await this.deckService.findByUserId(user.uid);
  }

  @Mutation()
  async createDeck(
    @User() user: auth.DecodedIdToken,
    @Args('data') data: ValidatedDeckCreateInput,
  ) {
    return await this.deckService.createDeck(user.uid, data.name);
  }
}
