import { StartDrawTimeActionType } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';

export function grantStartDrawTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (gameEntity.phase === null && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
      { value: StartDrawTimeActionType.START_DRAW_TIME },
    ];
  }
}
