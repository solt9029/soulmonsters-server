import { ActionType } from './../../../graphql/index';
import { GameEntity } from './../../../entities/game.entity';

export function isStartDrawTimeGranted(gameEntity: GameEntity, userId: string) {
  return gameEntity.phase === null && gameEntity.turnUserId === userId;
}

export function grantStartDrawTime(gameEntity: GameEntity, userId: string) {
  const yourGameUserIndex = gameEntity.gameUsers.findIndex(
    value => value.userId === userId,
  );
  gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
    ActionType.START_DRAW_TIME,
  ];
  return gameEntity;
}
