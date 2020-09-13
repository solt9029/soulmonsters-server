import { Zone } from 'src/graphql';
import { GameCardRepository } from './../services/game.service';
import { GameEntity } from './../entities/game.entity';
import { DispatchGameActionInput } from './../graphql/index';
import { EntityManager } from 'typeorm';

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: DispatchGameActionInput,
  gameEntity: GameEntity,
) {
  const yourSoulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  const yourSoulGameCardMaxPosition =
    yourSoulGameCards.length > 0 ? yourSoulGameCards[0].position : -1;
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameCard = await gameCardRepository.findOne({ id: data.gameCardId });
  await gameCardRepository.update(
    { id: data.gameCardId },
    { position: yourSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
  );
  await gameCardRepository.query(
    `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${gameCard.position} ORDER BY position`,
  );
  // TODO: add status that the user has already put a card on the soul zone.
}
