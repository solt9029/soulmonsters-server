import { GameStateEntity } from '../entities/game.state.entity';
import { ActionValidationLogic } from './../logics/action.validation.logic';
import { ActionGrantLogic } from './../logics/action.grant.logic';
import {
  DispatchGameActionInput,
  Phase,
  Zone,
  BattlePosition,
} from './../graphql/index';
import { UserService } from './user.service';
import { ActionType } from '../graphql/index';
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
import {
  Repository,
  Connection,
  EntityRepository,
  EntityManager,
} from 'typeorm';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { handleAttackAction } from 'src/handlers/attack.action.handler';
import { handleStartDrawTimeAction } from 'src/handlers/start.draw.time.action.handler';
import { handleStartEnergyTimeAction } from 'src/handlers/start.energy.time.action.handler';
import { handleStartPutTimeAction } from 'src/handlers/start.put.time.action.handler';
import { handlePutSoulAction } from 'src/handlers/put.soul.action.handler';
import { handleStartSomethingTimeAction } from 'src/handlers/start.something.time.action.handler';
import { handleSummonMonsterAction } from 'src/handlers/summon.monster.action.handler';
import { handleStartBattleTimeAction } from 'src/handlers/start.battle.time.action.handler';
import { handleStartEndTimeAction } from 'src/handlers/start.end.time.action.handler';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}

@EntityRepository(GameUserEntity)
export class GameUserRepository extends Repository<GameUserEntity> {}

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {}

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {}

@EntityRepository(GameStateEntity)
export class GameStateRepository extends Repository<GameStateEntity> {}

const MIN_COUNT = 40;

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private connection: Connection,
    private gameCardEntityFactory: GameCardEntityFactory,
    private actionGrantLogic: ActionGrantLogic,
    private actionValidationLogic: ActionValidationLogic,
  ) {}

  async findActiveGameByUserId(userId: string): Promise<GameEntity> {
    return await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
  }

  async findById(id: number): Promise<GameEntity> {
    return await this.gameRepository.findOne({
      where: { id },
      relations: [
        'gameUsers',
        'gameUsers.deck',
        'gameCards',
        'gameCards.card',
        'gameHistories',
      ],
    });
  }

  async dispatchAction(
    id: number,
    userId: string,
    data: DispatchGameActionInput,
  ) {
    return this.connection.transaction(async manager => {
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameEntity = await gameRepository
        .createQueryBuilder('games')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .leftJoinAndSelect('games.gameCards', 'gameCards')
        .leftJoinAndSelect('gameCards.card', 'card')
        .where('games.id = :id', { id })
        .getOne();

      const grantedGameEntity = this.actionGrantLogic.grantActions(
        gameEntity,
        userId,
      );

      this.actionValidationLogic.validateActions(
        data,
        grantedGameEntity,
        userId,
      );

      // TODO: reflect status for gameEntity
      // [WARNING] this implementation is just for handleAttackAction. not correct!
      for (let i = 0; i < gameEntity.gameCards.length; i++) {
        gameEntity.gameCards[i].attack = gameEntity.gameCards[i].card.attack;
        gameEntity.gameCards[i].defence = gameEntity.gameCards[i].card.defence;
      }

      // TODO:check events

      switch (data.type) {
        case ActionType.START_DRAW_TIME:
          return await handleStartDrawTimeAction(
            manager,
            id,
            userId,
            gameEntity,
          );
        case ActionType.START_ENERGY_TIME:
          return await handleStartEnergyTimeAction(
            manager,
            id,
            userId,
            gameEntity,
          );
        case ActionType.START_PUT_TIME:
          return await handleStartPutTimeAction(manager, id);
        case ActionType.PUT_SOUL:
          return await handlePutSoulAction(manager, userId, data, gameEntity);
        case ActionType.START_SOMETHING_TIME:
          return await handleStartSomethingTimeAction(manager, id);
        case ActionType.SUMMON_MONSTER:
          return await handleSummonMonsterAction(
            manager,
            userId,
            data,
            gameEntity,
          );
        case ActionType.START_BATTLE_TIME:
          return await handleStartBattleTimeAction(manager, id);
        case ActionType.START_END_TIME:
          return await handleStartEndTimeAction(manager, id);
        case ActionType.ATTACK:
          return await handleAttackAction(manager, userId, data, gameEntity);
        default:
          return;
      }
    });
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
