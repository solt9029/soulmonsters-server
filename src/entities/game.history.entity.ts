import { GameEntity } from './game.entity';
import { GameHistory } from './../graphql/index';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'gameHistories' })
export class GameHistoryEntity extends GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  detail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameHistories,
  )
  game: GameEntity;
}
