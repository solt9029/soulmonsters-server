import { InjectRepository } from '@nestjs/typeorm';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { GameCardEntity } from './../entities/game.card.entity';
import { DeckCardEntity } from './../entities/deck.card.entity';
import { PlayingUser } from './../graphql/index';
import { PlayerEntity } from './../entities/player.entity';
import { GameEntity } from './../entities/game.entity';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Repository, Connection, EntityRepository } from 'typeorm';
import { Status } from 'src/graphql';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {}

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {}

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {}

@Injectable()
export class GameService {
  private static get MIN_COUNT() {
    return 40;
  }

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private connection: Connection,
    private gameCardEntityFactory: GameCardEntityFactory,
  ) {}

  async findByUserId(userId: string): Promise<GameEntity> {
    return await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.players', 'players')
      .leftJoinAndSelect('games.gameCards', 'gameCards')
      .leftJoinAndSelect('gameCards.card', 'card')
      .where('games.firstUserId = :userId', { userId })
      .orWhere('games.secondUserId = :userId', { userId })
      .getOne();
  }

  async start(userId: string, deckId: number) {
    return this.connection.transaction(async manager => {
      const deckCardRepository = manager.getCustomRepository(
        DeckCardRepository,
      );
      const gameRepository = manager.getCustomRepository(GameRepository);
      const playerRepository = manager.getCustomRepository(PlayerRepository);
      const gameCardRepository = manager.getCustomRepository(
        GameCardRepository,
      );

      const userActiveGameEntity = await gameRepository
        .createQueryBuilder('games')
        .where('games.status != "END"')
        .andWhere(
          'games.firstUserId = :userId OR games.secondUserId = :userId',
          { userId },
        )
        .getOne();
      if (userActiveGameEntity !== undefined) {
        throw new BadRequestException();
      }

      const deckCardEntities = await deckCardRepository
        .createQueryBuilder('deckCards')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('deckCards.card', 'card')
        .leftJoinAndSelect('deckCards.deck', 'deck')
        .where('deckCards.deckId = :deckId', { deckId })
        .getMany();
      if (
        deckCardEntities.length > 0 &&
        deckCardEntities[0].deck.userId !== userId
      ) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const totalCount = deckCardEntities.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0,
      );
      if (totalCount < GameService.MIN_COUNT) {
        throw new BadRequestException('Min Count');
      }

      const waitingGameEntity = await gameRepository
        .createQueryBuilder('games')
        .setLock('pessimistic_read')
        .select()
        .where('games.status = :status', { status: Status.WAIT })
        .getOne();

      // If waiting game does not exist, create new game
      if (waitingGameEntity === undefined) {
        const gameInsertResult = await gameRepository.insert({
          firstUserId: userId,
        });
        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = this.gameCardEntityFactory.create(
          deckCardEntities,
          gameId,
        );
        await gameCardRepository.insert(gameCardEntities);
        await playerRepository.insert({
          userId,
          deck: { id: deckId },
          lastViewedAt: new Date(),
          game: { id: gameId },
        });

        return await gameRepository.findOne({
          where: { id: gameId },
          relations: ['players', 'players.deck'],
        });
      }

      // join the waiting game
      const gameCardEntities = this.gameCardEntityFactory.create(
        deckCardEntities,
        waitingGameEntity.id,
      );
      await gameCardRepository.insert(gameCardEntities);
      const playingUser =
        Math.floor(Math.random() * 2) === 1
          ? PlayingUser.FIRST
          : PlayingUser.SECOND;
      await playerRepository.insert({
        userId,
        deck: { id: deckId },
        energy: playingUser === PlayingUser.SECOND ? 0 : 1,
        lastViewedAt: new Date(),
        game: { id: waitingGameEntity.id },
      });
      await playerRepository.update(
        { userId: waitingGameEntity.firstUserId },
        { energy: playingUser === PlayingUser.FIRST ? 0 : 1 },
      );
      await gameRepository.update(
        { id: waitingGameEntity.id },
        {
          secondUserId: userId,
          playingUser,
          status: Status.PLAY,
          startedAt: new Date(),
        },
      );
      return await gameRepository.findOne({
        where: { id: waitingGameEntity.id },
        relations: ['players', 'players.deck'],
      });
    });
  }
}
