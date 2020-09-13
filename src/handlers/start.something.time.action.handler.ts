import { Phase } from './../graphql/index';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/services/game.service';

export async function handleStartSomethingTimeAction(
  manager: EntityManager,
  id: number,
) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  await gameRepository.update({ id }, { phase: Phase.SOMETHING });
}
