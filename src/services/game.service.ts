import { PlayingUser } from './../graphql/index';
import { PlayerEntity } from './../entities/player.entity';
import { GameEntity } from './../entities/game.entity';
import { DeckEntity } from './../entities/deck.entity';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, EntityRepository } from 'typeorm';
import { Status } from 'src/graphql';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {}

@Injectable()
export class GameService {
  constructor(private connection: Connection) {}

  async start(userId: string, deckId: number) {
    return this.connection.transaction(async manager => {
      const gameRepository = manager.getCustomRepository(GameRepository);
      const playerRepository = manager.getCustomRepository(PlayerRepository);

      const gameEntity = await gameRepository.findOne({
        where: { status: Status.WAIT },
      });

      // If waiting game does not exist, create new game
      if (gameEntity === undefined) {
        const gameInsertResult = await gameRepository.insert({
          firstUserId: userId,
        });
        const gameId = gameInsertResult.identifiers[0].id;
        await playerRepository.insert({
          userId,
          deck: { id: deckId },
          lastViewedAt: new Date(),
          game: { id: gameId },
        });
        return await gameRepository.findOne({
          where: { id: gameId },
          relations: ['players'],
        });
      }

      // join the waiting game
      const playingUser =
        Math.floor(Math.random() * 2) === 1
          ? PlayingUser.FIRST
          : PlayingUser.SECOND;
      await playerRepository.insert({
        userId,
        deck: { id: deckId },
        energy: playingUser === PlayingUser.SECOND ? 0 : 1,
        lastViewedAt: new Date(),
        game: { id: gameEntity.id },
      });
      await playerRepository.update(
        { userId: gameEntity.firstUserId },
        { energy: playingUser === PlayingUser.FIRST ? 0 : 1 },
      );
      await gameRepository.update(
        { id: gameEntity.id },
        {
          secondUserId: userId,
          playingUser,
          status: Status.PLAY,
          startedAt: new Date(),
        },
      );
      return await gameRepository.findOne({
        where: { id: gameEntity.id },
        relations: ['players'],
      });
    });
  }
}
