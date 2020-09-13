import {
  ActionType,
  Phase,
  Zone,
  Kind,
  BattlePosition,
} from '../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { Injectable } from '@nestjs/common';
import { grantStartDrawTimeAction } from './grantors/start.draw.time.action.grantor';
import { grantStartEnergyTimeAction } from './grantors/start.energy.time.action.grantor';
import { grantStartPutTimeAction } from './grantors/start.put.time.action.grantor';
import { grantStartSomethingTimeAction } from './grantors/start.something.time.action.grantor';
import { grantPutSoulAction } from './grantors/put.soul.action.grantor';

@Injectable()
export class ActionGrantor {
  grantActions(gameEntity: GameEntity, userId: string) {
    grantStartDrawTimeAction(gameEntity, userId);
    grantStartEnergyTimeAction(gameEntity, userId);
    grantStartPutTimeAction(gameEntity, userId);
    grantStartSomethingTimeAction(gameEntity, userId);
    grantPutSoulAction(gameEntity, userId);

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
          gameEntity.gameCards[i].battlePosition === BattlePosition.ATTACK &&
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
