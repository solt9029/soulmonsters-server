import { GameActionDispatchInput, Zone } from './../../graphql/index';
import { ActionType } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateAttackAction(
  data: GameActionDispatchInput,
  game: GameEntity,
  userId: string,
) {
  // check payload
  const { targetGameCardIds, targetGameUserIds, gameCardId } = data.payload;
  const hasTargetGameCardId =
    (targetGameCardIds || []).length === 1 &&
    (targetGameUserIds || []).length === 0;
  const hasTargetGameUserId =
    (targetGameCardIds || []).length === 0 &&
    (targetGameUserIds || []).length === 1;
  if (
    gameCardId === undefined ||
    (!hasTargetGameCardId && !hasTargetGameUserId)
  ) {
    throw new BadRequestException('攻撃の処理に失敗しました');
  }

  const gameCard = game.gameCards.find(value => value.id === gameCardId);

  if (
    !gameCard?.actionTypes?.includes(ActionType.ATTACK) ||
    game.turnUserId !== userId
  ) {
    throw new BadRequestException('攻撃の処理に失敗しました');
  }

  if (hasTargetGameUserId) {
    const opponentBattleGameCards = game.gameCards.filter(
      value => value.zone === Zone.BATTLE && value.currentUserId !== userId,
    );
    if (opponentBattleGameCards.length > 0) {
      throw new BadRequestException(
        '相手のバトルゾーンにモンスターが存在します',
      );
    }
  }

  if (hasTargetGameCardId) {
    const targetGameCard = game.gameCards.find(
      value => value.id === targetGameCardIds[0],
    );
    const opponentGameUser = game.gameUsers.find(
      value => value.userId !== userId,
    );

    if (
      targetGameCard.zone !== Zone.BATTLE ||
      targetGameCard.currentUserId !== opponentGameUser.userId
    ) {
      throw new BadRequestException(
        '選択された攻撃対象が相手のバトルゾーンのモンスターではありません',
      );
    }
  }

  // check state
}
