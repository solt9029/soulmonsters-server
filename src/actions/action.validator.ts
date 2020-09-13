import { DispatchGameActionInput } from '../graphql/index';
import { ActionType } from '../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { Injectable } from '@nestjs/common';
import { validateStartDrawTime } from './validators/start.draw.time.validator';
import { validateStartEnergyTime } from './validators/start.energy.time.validator';

@Injectable()
export class ActionValidator {
  validateActions(
    data: DispatchGameActionInput,
    grantedGameEntity: GameEntity,
    userId: string,
  ) {
    switch (data.type) {
      case ActionType.START_DRAW_TIME:
        return validateStartDrawTime(grantedGameEntity, userId);
      case ActionType.START_ENERGY_TIME:
        return validateStartEnergyTime(grantedGameEntity, userId);
      default:
        return;
    }
  }
}
