import {
  Action,
  StartDrawTimeActionType,
  StartEnergyTimeActionType,
  PutSoulActionType,
} from './../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { Injectable } from '@nestjs/common';
import { validateStartDrawTimeAction } from './validators/start.draw.time.action.validator';
import { validateStartEnergyTimeAction } from './validators/start.energy.time.action.validator';
import { validatePutSoulAction } from './validators/put.soul.action.validator';

@Injectable()
export class ActionValidator {
  validateActions(
    action: Action,
    grantedGameEntity: GameEntity,
    userId: string,
  ) {
    switch (action.type) {
      case StartDrawTimeActionType.START_DRAW_TIME:
        return validateStartDrawTimeAction(grantedGameEntity, userId);
      case StartEnergyTimeActionType.START_ENERGY_TIME:
        return validateStartEnergyTimeAction(grantedGameEntity, userId);
      case PutSoulActionType.PUT_SOUL:
        return validatePutSoulAction(action, grantedGameEntity, userId);
      default:
        return;
    }
  }
}
