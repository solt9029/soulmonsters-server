import { DeckCardService } from './../services/deck.card.service';
import { GameService } from './../services/game.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  UseGuards,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class GameResolver {
  private static get MIN_COUNT() {
    return 40;
  }

  constructor(
    private readonly gameService: GameService,
    private readonly deckCardService: DeckCardService,
  ) {}

  @Mutation()
  async startGame(
    @User() user: auth.DecodedIdToken,
    @Args('deckId') deckId: number,
  ) {
    const deckCards = await this.deckCardService.findByDeckId(deckId);
    if (deckCards.length > 0 && deckCards[0].deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    if (deckCards.length < GameResolver.MIN_COUNT) {
      throw new BadRequestException('Min Count');
    }
    return await this.gameService.start(user.uid, deckId);
  }
}
