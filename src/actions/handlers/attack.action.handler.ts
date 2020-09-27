import { AttackActionType } from './../../graphql/index';
import { MAX_ENERGY } from './../../constants/rule';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { GameEntity } from './../../entities/game.entity';
import { Zone } from 'src/graphql';
import {
  GameUserRepository,
  GameCardRepository,
  GameStateRepository,
} from '../../services/game.service';
import { Action, BattlePosition, StateType } from '../../graphql/index';
import { EntityManager } from 'typeorm';

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  action: Action,
  gameEntity: GameEntity,
) {
  if (action.type !== AttackActionType.ATTACK) {
    return;
  }

  const gameUserRepository = manager.getCustomRepository(GameUserRepository);
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameStateRepository = manager.getCustomRepository(GameStateRepository);

  const gameCard = gameEntity.gameCards.find(
    value => value.id === action.payload.gameCardId,
  );
  const opponentGameUser = gameEntity.gameUsers.find(
    value => value.userId !== userId,
  );

  if (action.payload.targetGameUserId) {
    await gameUserRepository.update(
      { id: opponentGameUser.id },
      { lifePoint: opponentGameUser.lifePoint - gameCard.attack },
    );
  } else {
    const targetGameCard = gameEntity.gameCards.find(
      value => value.id === action.payload.targetGameCardId,
    );
    const yourGameUser = gameEntity.gameUsers.find(
      value => value.userId === userId,
    );
    const yourSoulGameCards = gameEntity.gameCards
      .filter(
        value => value.zone === Zone.SOUL && value.currentUserId === userId,
      )
      .sort((a, b) => b.position - a.position);
    const yourSoulGameCardMaxPosition =
      yourSoulGameCards.length > 0 ? yourSoulGameCards[0].position : -1;
    const opponentSoulGameCards = gameEntity.gameCards
      .filter(
        value => value.zone === Zone.SOUL && value.currentUserId !== userId,
      )
      .sort((a, b) => b.position - a.position);
    const opponentSoulGameCardMaxPosition =
      opponentSoulGameCards.length > 0 ? opponentSoulGameCards[0].position : -1;

    if (targetGameCard.battlePosition === BattlePosition.ATTACK) {
      if (gameCard.attack >= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: targetGameCard.id },
          { position: opponentSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
        );
        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${opponentGameUser.id}" AND position > ${targetGameCard.position} ORDER BY position`,
        );
        if (opponentGameUser.energy < MAX_ENERGY) {
          await manager.update(
            GameUserEntity,
            { id: opponentGameUser.id },
            { energy: opponentGameUser.energy + 1 },
          );
        }
      }
      if (gameCard.attack <= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: gameCard.id },
          { position: yourSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
        );
        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${yourGameUser.id}" AND position > ${gameCard.position} ORDER BY position`,
        );
        if (yourGameUser.energy < MAX_ENERGY) {
          await manager.update(
            GameUserEntity,
            { id: yourGameUser.id },
            { energy: yourGameUser.energy + 1 },
          );
        }
      }
      if (gameCard.attack != targetGameCard.attack) {
        const damagePoint = Math.abs(gameCard.attack - targetGameCard.attack);
        const damagedGameUser =
          gameCard.attack > targetGameCard.attack
            ? opponentGameUser
            : yourGameUser;
        await gameUserRepository.update(
          { id: damagedGameUser.id },
          { lifePoint: damagedGameUser.lifePoint - damagePoint },
        );
      }
    }
    if (targetGameCard.battlePosition === BattlePosition.DEFENCE) {
      if (gameCard.attack > targetGameCard.defence) {
        await gameCardRepository.update(
          { id: targetGameCard.id },
          { position: opponentSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
        );
        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${opponentGameUser.id}" AND position > ${targetGameCard.position} ORDER BY position`,
        );
      }
      if (gameCard.attack < targetGameCard.defence) {
        const damagePoint = targetGameCard.defence - gameCard.attack;
        await gameUserRepository.update(
          { id: yourGameUser.id },
          { lifePoint: opponentGameUser.lifePoint - damagePoint },
        );
      }
    }
  }

  // add attack count state
  const updatedGameCard = await gameCardRepository.findOne({
    id: action.payload.gameCardId,
  });
  const gameStates = await gameStateRepository.find({
    game: gameEntity,
    gameCard: updatedGameCard,
  });
  const attackCountGameState = gameStates.find(
    gameState => gameState.state.type === StateType.ATTACK_COUNT,
  );
  if (updatedGameCard.zone === Zone.BATTLE) {
    if (attackCountGameState === undefined) {
      gameStateRepository.insert({
        game: gameEntity,
        gameCard: updatedGameCard,
        state: { type: StateType.ATTACK_COUNT, data: { value: 1 } },
      });
      return;
    }
    gameStateRepository.update(
      { id: attackCountGameState.id },
      {
        state: {
          type: StateType.ATTACK_COUNT,
          data: { value: attackCountGameState.state.data['value'] + 1 },
        },
      },
    );
  }
}
