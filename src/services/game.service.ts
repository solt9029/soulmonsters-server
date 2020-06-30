import { ActionValidationLogic } from './../logics/action.validation.logic';
import { ActionGrantLogic } from './../logics/action.grant.logic';
import { DispatchGameActionInput, Phase, Zone } from './../graphql/index';
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

      // TODO:check events

      switch (data.type) {
        case ActionType.START_DRAW_TIME:
          return await this.handleStartDrawTimeAction(
            manager,
            id,
            userId,
            gameEntity,
          );
        case ActionType.START_ENERGY_TIME:
          return await this.handleStartEnergyTimeAction(
            manager,
            id,
            userId,
            gameEntity,
          );
        case ActionType.START_PUT_TIME:
          return await this.handleStartPutTimeAction(manager, id);
        case ActionType.PUT_SOUL:
          return await this.handlePutSoulAction(
            manager,
            userId,
            data,
            gameEntity,
          );
        default:
          return;
      }
    });
  }

  private async handleStartDrawTimeAction(
    manager: EntityManager,
    id: number,
    userId: string,
    gameEntity: GameEntity,
  ) {
    const gameRepository = manager.getCustomRepository(GameRepository);
    const gameCardRepository = manager.getCustomRepository(GameCardRepository);
    await gameRepository.update({ id }, { phase: Phase.DRAW });
    const yourDeckGameCards = gameEntity.gameCards
      .filter(
        value => value.zone === Zone.DECK && value.currentUserId === userId,
      )
      .sort((a, b) => b.position - a.position);
    if (yourDeckGameCards.length <= 0) {
      // TODO: the opponent user wins
    }
    const yourHandGameCards = gameEntity.gameCards
      .filter(
        value => value.zone === Zone.HAND && value.currentUserId === userId,
      )
      .sort((a, b) => b.position - a.position);
    await gameCardRepository.update(
      { id: yourDeckGameCards[0].id },
      { zone: Zone.HAND, position: yourHandGameCards[0].position + 1 },
    );
  }

  private async handleStartEnergyTimeAction(
    manager: EntityManager,
    id: number,
    userId: string,
    gameEntity: GameEntity,
  ) {
    const gameUserRepository = manager.getCustomRepository(GameUserRepository);
    const gameRepository = manager.getCustomRepository(GameRepository);
    const yourGameUser = gameEntity.gameUsers.find(
      value => value.userId === userId,
    );
    if (!yourGameUser) {
      throw new BadRequestException('User Not Found');
    }
    let newEnergy = yourGameUser.energy + 2;
    if (newEnergy > 8) {
      newEnergy = 8;
    }
    await gameUserRepository.update(
      { userId, game: { id } },
      { energy: newEnergy },
    );
    await gameRepository.update({ id }, { phase: Phase.ENERGY });
  }

  private async handleStartPutTimeAction(manager: EntityManager, id: number) {
    const gameRepository = manager.getCustomRepository(GameRepository);
    await gameRepository.update({ id }, { phase: Phase.PUT });
  }

  private async handlePutSoulAction(
    manager: EntityManager,
    userId: string,
    data: DispatchGameActionInput,
    gameEntity: GameEntity,
  ) {
    const yourSoulGameCards = gameEntity.gameCards
      .filter(
        value => value.zone === Zone.SOUL && value.currentUserId === userId,
      )
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
