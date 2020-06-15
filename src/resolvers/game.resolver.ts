import { DispatchGameActionInput } from './../graphql/index';
import { GameService } from './../services/game.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query()
  async game(@User() user: auth.DecodedIdToken, @Args('id') id: number) {
    return await this.gameService.findByIdAndFilterByUserId(id, user.uid);
  }

  @Query()
  async activeGameId(@User() user: auth.DecodedIdToken) {
    const activeGame = await this.gameService.findActiveGameByUserId(user.uid);
    if (activeGame === undefined) {
      return null;
    }
    return activeGame.id;
  }

  @Mutation()
  async startGame(
    @User() user: auth.DecodedIdToken,
    @Args('deckId') deckId: number,
  ) {
    return await this.gameService.start(user.uid, deckId);
  }

  @Mutation()
  async dispatchGameAction(
    @User() user: auth.DecodedIdToken,
    @Args('id') id: number,
    @Args('data') data: DispatchGameActionInput,
  ) {
    return await this.gameService.reduce(id, user.uid, data);
  }
}
