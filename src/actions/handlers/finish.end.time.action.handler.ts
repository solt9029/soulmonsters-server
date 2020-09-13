import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/services/game.service';

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  id: number,
) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  await gameRepository.update({ id }, { phase: null });
}
