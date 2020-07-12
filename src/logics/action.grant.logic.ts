import { ActionType, Phase, Zone, Kind } from './../graphql/index';
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
      gameEntity.gameUsers[yourGameUserIndex].actionTypes.push(
        ActionType.START_SOMETHING_TIME,
      );

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

      for (let i = 0; i < gameEntity.gameCards.length; i++) {
        if (
          gameEntity.gameCards[i].zone === Zone.HAND &&
          gameEntity.gameCards[i].currentUserId === userId &&
          gameEntity.gameCards[i].kind === Kind.MONSTER
        ) {
          gameEntity.gameCards[i].actionTypes.push(ActionType.SUMMON_MONSTER);
        }
      }
    }

    if (gameEntity.phase === Phase.BATTLE && gameEntity.turnUserId === userId) {
      for (let i = 0; i < gameEntity.gameCards.length; i++) {
        if (
          gameEntity.gameCards[i].zone === Zone.BATTLE &&
          gameEntity.gameCards[i].currentUserId === userId
        ) {
          // TODO: check status before this addition
          gameEntity.gameCards[i].actionTypes.push(ActionType.ATTACK);
        }
      }
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
