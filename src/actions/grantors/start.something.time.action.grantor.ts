import { Phase, StartSomethingTimeActionType } from './../../graphql/index';
import { GameEntity } from './../../entities/game.entity';

export function grantStartSomethingTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (gameEntity.phase === Phase.PUT && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes.push({
      value: StartSomethingTimeActionType.START_SOMETHING_TIME,
    });
  }
}
