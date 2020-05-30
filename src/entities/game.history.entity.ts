import { GameEntity } from './game.entity';
import { GameHistory } from './../graphql/index';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity({ name: 'gameHistories' })
export class GameHistoryEntity extends GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  detail: string;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameHistories,
  )
  game: GameEntity;
}
