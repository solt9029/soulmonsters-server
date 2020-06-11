import { Action } from '../graphql/index';
import { InjectRepository } from '@nestjs/typeorm';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { GameCardEntity } from './../entities/game.card.entity';
import { DeckCardEntity } from './../entities/deck.card.entity';
import { GameEntity } from './../entities/game.entity';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Repository, Connection, EntityRepository } from 'typeorm';
import { GameUserEntity } from 'src/entities/game.user.entity';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}

@EntityRepository(GameUserEntity)
export class GameUserRepository extends Repository<GameUserEntity> {}

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {}

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {}

const MIN_COUNT = 40;

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private connection: Connection,
    private gameCardEntityFactory: GameCardEntityFactory,
  ) {}

  async findActiveGameByUserId(userId: string): Promise<GameEntity> {
    return await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
  }

  async findByIdAndFilterByUserId(
    id: number,
    userId: string,
  ): Promise<GameEntity> {
    const gameEntity = await this.gameRepository.findOne({
      where: { id },
      relations: [
        'gameUsers',
        'gameUsers.deck',
        'gameCards',
        'gameCards.card',
        'gameHistories',
      ],
    });

    gameEntity.gameCards = gameEntity.gameCards.map(value =>
      this.gameCardEntityFactory.filterByUserId(value, userId),
    );

    // TODO: Move this process to other components
    if (gameEntity.phase === null && gameEntity.turnUserId === userId) {
      const gameUserIndex = gameEntity.gameUsers.findIndex(
        value => value.userId === userId,
      );
      gameEntity.gameUsers[gameUserIndex].actions = [Action.START_DRAW_TIME];
    }

    return gameEntity;
  }

  async start(userId: string, deckId: number) {
    return this.connection.transaction(async manager => {
      const deckCardRepository = manager.getCustomRepository(
        DeckCardRepository,
      );
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameUserRepository = manager.getCustomRepository(
        GameUserRepository,
      );
      const gameCardRepository = manager.getCustomRepository(
        GameCardRepository,
      );

      const userActiveGameEntity = await gameRepository
        .createQueryBuilder('games')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .where('games.winnerUserId IS NULL')
        .andWhere('gameUsers.userId = :userId', { userId })
        .getOne();
      if (userActiveGameEntity !== undefined) {
        throw new BadRequestException('User Active');
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
      if (totalCount < MIN_COUNT) {
        throw new BadRequestException('Min Count');
      }

      const waitingGameRawDataPackets: {
        id: number;
      }[] = await gameUserRepository.query(
        'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
      );

      // If waiting game does not exist, create new game
      if (waitingGameRawDataPackets.length === 0) {
        const gameInsertResult = await gameRepository.insert({});
        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = this.gameCardEntityFactory.create(
          deckCardEntities,
          gameId,
        );
        await gameCardRepository.insert(gameCardEntities);
        await gameUserRepository.insert({
          userId,
          deck: { id: deckId },
          lastViewedAt: new Date(),
          game: { id: gameId },
        });

        return await gameRepository.findOne({
          where: { id: gameId },
          relations: ['gameUsers', 'gameUsers.deck'],
        });
      }

      // join the waiting game
      const waitingGameEntity = await gameRepository
        .createQueryBuilder('games')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .where('games.id = :gameId', {
          gameId: waitingGameRawDataPackets[0].id,
        })
        .getOne();
      const gameCardEntities = this.gameCardEntityFactory.create(
        deckCardEntities,
        waitingGameEntity.id,
      );
      await gameCardRepository.insert(gameCardEntities);
      const turnUserId =
        Math.floor(Math.random() * 2) === 1
          ? waitingGameEntity.gameUsers[0].userId
          : userId;
      await gameUserRepository.insert({
        userId,
        deck: { id: deckId },
        energy: turnUserId === userId ? 0 : 1,
        lastViewedAt: new Date(),
        game: { id: waitingGameEntity.id },
      });
      await gameUserRepository.update(
        { userId: waitingGameEntity.gameUsers[0].userId },
        { energy: turnUserId === userId ? 1 : 0 },
      );
      await gameRepository.update(
        { id: waitingGameEntity.id },
        { startedAt: new Date(), turnUserId },
      );
      return await gameRepository.findOne({
        where: { id: waitingGameEntity.id },
        relations: ['gameUsers', 'gameUsers.deck'],
      });
    });
  }
}
