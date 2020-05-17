import { DeckService } from './../services/deck.service';
import { DeckCardUpdateInput } from './../graphql/index';
import { DeckCardService } from './../services/deck.card.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  UseGuards,
  HttpStatus,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

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
    @User() user: auth.DecodedIdToken,
    @Args('deckId') deckId: number,
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

  @Mutation()
  async plusDeckCard(
    @Args('data') data: DeckCardUpdateInput,
    @User() user: auth.DecodedIdToken,
  ) {
    const { deckId, cardId } = data;

    const deckCardEntity = await this.deckCardService.findByDeckIdAndCardId(
      deckId,
      cardId,
    );

    if (deckCardEntity !== undefined) {
      if (deckCardEntity.deck.userId !== user.uid) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      if (deckCardEntity.count >= DeckCardResolver.MAX_COUNT) {
        throw new BadRequestException('Max Count');
      }
      return await this.deckCardService.updateCountById(
        deckCardEntity.id,
        deckCardEntity.count + 1,
      );
    }

    const deckEntity = await this.deckService.findById(deckId);
    if (deckEntity === undefined) {
      throw new NotFoundException();
    }
    if (deckEntity.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.deckCardService.create(deckId, cardId);
  }
}
