import { GameEntity } from './../../entities/game.entity';
import { Phase, FinishEndTimeActionType } from './../../graphql/index';

export function grantFinishEndTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (gameEntity.phase === Phase.END && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
      { value: FinishEndTimeActionType.FINISH_END_TIME },
    ];
  }
}
