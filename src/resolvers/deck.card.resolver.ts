import { DeckCardUpdateInput } from './../graphql/index';
import { DeckService } from './../services/deck.service';
import { DeckCardService } from './../services/deck.card.service';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from 'src/decorators/user.decorator';
import { auth } from 'firebase-admin';
import {
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  private static get MAX_COUNT() {
    return 3;
  }
  private static get MIN_COUNT() {
    return 1;
  }

  constructor(
    private readonly deckCardService: DeckCardService,
    private readonly deckService: DeckService,
  ) {}

  @Query()
  async deckCards(
    @Args('deckId') deckId: string,
    @User() user: auth.DecodedIdToken,
  ) {
    const deckCards = await this.deckCardService.findByDeckId(deckId);

    if (deckCards.length > 0 && deckCards[0].deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return deckCards;
  }

  @Mutation()
  async plusDeckCard(
    @Args('data') data: DeckCardUpdateInput,
    @User() user: auth.DecodedIdToken,
  ) {
    const { deckId, cardId } = data;

    const deckCards = await this.deckCardService.findByDeckIdAndCardId(
      deckId,
      cardId,
    );
    if (deckCards.length > 0) {
      if (deckCards[0].deck.userId !== user.uid) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      if (deckCards[0].count >= DeckCardResolver.MAX_COUNT) {
        throw new BadRequestException('Max Count');
      }

      return await this.deckCardService.updateCountById(
        deckCards[0].id,
        deckCards[0].count + 1,
      );
    }

    const deck = await this.deckService.findById(deckId);
    if (deck === null) {
      throw new NotFoundException();
    }
    if (deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.deckCardService.create(deckId, cardId);
  }

  @Mutation()
  async minusDeckCard(
    @Args('data') data: DeckCardUpdateInput,
    @User() user: auth.DecodedIdToken,
  ) {
    const { deckId, cardId } = data;

    const deckCards = await this.deckCardService.findByDeckIdAndCardId(
      deckId,
      cardId,
    );

    if (deckCards.length < 1) {
      throw new NotFoundException();
    }

    if (deckCards[0].deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (deckCards[0].count > DeckCardResolver.MIN_COUNT) {
      return await this.deckCardService.updateCountById(
        deckCards[0].id,
        deckCards[0].count - 1,
      );
    }

    return await this.deckCardService.delete(deckCards[0].id);
  }
}
