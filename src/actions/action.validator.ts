import { DispatchGameActionInput } from '../graphql/index';
import { ActionType } from '../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { Injectable } from '@nestjs/common';
import { validateStartDrawTimeAction } from './validators/start.draw.time.action.validator';
import { validateStartEnergyTimeAction } from './validators/start.energy.time.action.validator';

@Injectable()
export class ActionValidator {
  validateActions(
    data: DispatchGameActionInput,
    grantedGameEntity: GameEntity,
    userId: string,
  ) {
    switch (data.type) {
      case ActionType.START_DRAW_TIME:
        return validateStartDrawTimeAction(grantedGameEntity, userId);
      case ActionType.START_ENERGY_TIME:
        return validateStartEnergyTimeAction(grantedGameEntity, userId);
      default:
        return;
    }
  }
}
