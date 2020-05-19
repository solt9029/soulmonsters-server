import { GameService } from './../services/game.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation()
  async startGame(
    @User() user: auth.DecodedIdToken,
    @Args('deckId') deckId: number,
  ) {
    return await this.gameService.start(user.uid, deckId);
  }
}
