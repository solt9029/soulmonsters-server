import { GameEntity } from './game.entity';
import { GameCardEntity } from './game.card.entity';
import { StateType } from '../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'gameStates' })
export class GameStateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameStates,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;

  @ManyToOne(
    () => GameCardEntity,
    gameCardEntity => gameCardEntity.gameStates,
    { onDelete: 'CASCADE' },
  )
  gameCard: GameCardEntity;

  @Column()
  stateType: StateType;

  @Column({ type: 'json' })
  data: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
