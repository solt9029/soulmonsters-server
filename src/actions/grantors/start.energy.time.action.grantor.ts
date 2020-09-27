import { GameEntity } from './../../entities/game.entity';
import { Phase, StartEnergyTimeActionType } from './../../graphql/index';

export function grantStartEnergyTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (gameEntity.phase === Phase.DRAW && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(
      value => value.userId === userId,
    );
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [
      { value: StartEnergyTimeActionType.START_ENERGY_TIME },
    ];
  }
}
