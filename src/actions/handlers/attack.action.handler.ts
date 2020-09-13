import { Zone } from 'src/graphql';
import {
  GameUserRepository,
  GameCardRepository,
  GameStateRepository,
} from '../../services/game.service';
import { GameEntity } from '../../entities/game.entity';
import {
  DispatchGameActionInput,
  BattlePosition,
  StateType,
} from '../../graphql/index';
import { EntityManager } from 'typeorm';

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  data: DispatchGameActionInput,
  gameEntity: GameEntity,
) {
  const gameUserRepository = manager.getCustomRepository(GameUserRepository);
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameStateRepository = manager.getCustomRepository(GameStateRepository);

  const gameCard = gameEntity.gameCards.find(
    value => value.id === data.gameCardId,
  );
  const opponentGameUser = gameEntity.gameUsers.find(
    value => value.userId !== userId,
  );

  if (data.payload.targetGameUserIds.length === 1) {
    await gameUserRepository.update(
      { id: opponentGameUser.id },
      { lifePoint: opponentGameUser.lifePoint - gameCard.attack },
    );
  } else {
    const targetGameCard = gameEntity.gameCards.find(
      value => value.id === data.payload.targetGameCardIds[0],
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
    console.log(targetGameCard);
    console.log(yourSoulGameCardMaxPosition);
    console.log(opponentSoulGameCardMaxPosition);

    if (targetGameCard.battlePosition === BattlePosition.ATTACK) {
      if (gameCard.attack >= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: targetGameCard.id },
          { position: opponentSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
        );
        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${opponentGameUser.id}" AND position > ${targetGameCard.position} ORDER BY position`,
        );
        // TODO: plus 1 energy
      }
      if (gameCard.attack <= targetGameCard.attack) {
        await gameCardRepository.update(
          { id: gameCard.id },
          { position: yourSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
        );
        await gameCardRepository.query(
          `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "BATTLE" AND currentUserId = "${yourGameUser.id}" AND position > ${gameCard.position} ORDER BY position`,
        );
        // TODO: plus 1 energy
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
    id: data.gameCardId,
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
