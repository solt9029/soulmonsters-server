import { ActionType, Phase } from './../graphql/index';
import { GameEntity } from './../entities/game.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionGrantLogic {
  grantActions(gameEntity: GameEntity, userId: string) {
    if (gameEntity.phase === null && gameEntity.turnUserId === userId) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_DRAW_TIME,
      ];
    }
    if (gameEntity.phase === Phase.DRAW && gameEntity.turnUserId === userId) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_ENERGY_TIME,
      ];
    }
    if (gameEntity.phase === Phase.ENERGY && gameEntity.turnUserId === userId) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_PUT_TIME,
      ];
    }
    if (gameEntity.phase === Phase.PUT && gameEntity.turnUserId === userId) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_SOMETHING_TIME,
      ];
    }
    if (
      gameEntity.phase === Phase.SOMETHING &&
      gameEntity.turnUserId === userId
    ) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_BATTLE_TIME,
      ];
    }
    if (gameEntity.phase === Phase.BATTLE && gameEntity.turnUserId === userId) {
      const yourGameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
        ActionType.START_END_TIME,
      ];
    }

    return gameEntity;
  }
}
