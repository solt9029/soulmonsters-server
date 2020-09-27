import { GameEntity } from './../../entities/game.entity';
import { Phase, StartPutTimeActionType } from './../../graphql/index';

export function grantStartPutTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (gameEntity.phase === Phase.ENERGY && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
      { value: StartPutTimeActionType.START_PUT_TIME },
    ];
  }
}
