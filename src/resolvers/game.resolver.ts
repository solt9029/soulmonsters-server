import { ActionGrantLogic } from './../logics/action.grant.logic';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { GameUserEntityFactory } from './../factories/game.user.entity.factory';
import { UserService } from './../services/user.service';
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
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private gameUserEntityFactory: GameUserEntityFactory,
    private gameCardEntityFactory: GameCardEntityFactory,
    private actionGrantLogic: ActionGrantLogic,
  ) {}

  @Query()
  async game(@User() user: auth.DecodedIdToken, @Args('id') id: number) {
    let gameEntity = await this.gameService.findById(id);

    gameEntity.gameUsers = await Promise.all(
      gameEntity.gameUsers.map(async value => {
        const userRecord = await this.userService.findById(value.userId);
        return this.gameUserEntityFactory.addUser(value, userRecord);
      }),
    );

    gameEntity.gameCards = gameEntity.gameCards.map(value =>
      this.gameCardEntityFactory.filterByUserId(value, user.uid),
    );

    gameEntity = this.actionGrantLogic.grantActions(gameEntity, user.uid);

    return gameEntity;
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
    await this.gameService.reduce(id, user.uid, data);
    return await this.game(user, id);
  }
}
