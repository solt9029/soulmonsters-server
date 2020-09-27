import { Phase, StartBattleTimeActionType } from './../../graphql/index';
import { GameEntity } from './../../entities/game.entity';

export function grantStartBattleTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (
    gameEntity.phase === Phase.SOMETHING &&
    gameEntity.turnUserId === userId
  ) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
      { value: StartBattleTimeActionType.START_BATTLE_TIME },
    ];
  }
}
