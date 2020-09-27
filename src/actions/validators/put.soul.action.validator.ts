import { Action, PutSoulActionType } from './../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validatePutSoulAction(
  action: Action,
  game: GameEntity,
  userId: string,
) {
  if (action.type !== PutSoulActionType.PUT_SOUL) {
    return;
  }

  const gameCard = game.gameCards.find(
    value => value.id === action.payload.gameCardId,
  );
  if (
    !gameCard?.actionTypes?.includes({ value: PutSoulActionType.PUT_SOUL }) ||
    game.turnUserId !== userId
  ) {
    throw new BadRequestException();
  }
}
