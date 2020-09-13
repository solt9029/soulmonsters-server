import { GameEntity } from './../../entities/game.entity';
import { Zone } from 'src/graphql';
import { Phase, BattlePosition, ActionType } from './../../graphql/index';

export function grantAttackAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.BATTLE && gameEntity.turnUserId === userId) {
    for (let i = 0; i < gameEntity.gameCards.length; i++) {
      if (
        gameEntity.gameCards[i].zone === Zone.BATTLE &&
        gameEntity.gameCards[i].battlePosition === BattlePosition.ATTACK &&
        gameEntity.gameCards[i].currentUserId === userId
      ) {
        // TODO: check status before this addition
        gameEntity.gameCards[i].actionTypes.push(ActionType.ATTACK);
      }
    }
  }
}
