import { DispatchGameActionInput } from './../graphql/index';
import { ActionType } from '../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ActionValidationLogic {
  validateActions(
    data: DispatchGameActionInput,
    grantedGameEntity: GameEntity,
    userId: string,
  ) {
    switch (data.type) {
      case ActionType.START_DRAW_TIME:
        this.validateStartDrawTime(grantedGameEntity, userId);
      default:
        break;
    }
  }

  private validateStartDrawTime(gameEntity: GameEntity, userId: string) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    if (
      !gameEntity.gameUsers[yourGameUserIndex].actionTypes.includes(
        ActionType.START_DRAW_TIME,
      )
    ) {
      throw new BadRequestException();
    }
  }
}
