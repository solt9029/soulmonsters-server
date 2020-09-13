import { GameEntity } from './../../entities/game.entity';
import { Zone } from 'src/graphql';
import { Phase, ActionType } from './../../graphql/index';

export function grantPutSoulAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.PUT && gameEntity.turnUserId === userId) {
    // TODO: check status before this addition
    for (let i = 0; i < gameEntity.gameCards.length; i++) {
      if (
        gameEntity.gameCards[i].zone === Zone.HAND &&
        gameEntity.gameCards[i].currentUserId === userId
      ) {
        gameEntity.gameCards[i].actionTypes.push(ActionType.PUT_SOUL);
      }
    }
  }
}
