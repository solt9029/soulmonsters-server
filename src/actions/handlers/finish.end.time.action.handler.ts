import { GameEntity } from './../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/services/game.service';

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  userId: string,
  id: number,
  game: GameEntity,
) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  const opponentGameUser = game.gameUsers.find(
    value => value.userId !== userId,
  );

  await gameRepository.update(
    { id },
    { phase: null, turnUserId: opponentGameUser.userId },
  );
}
