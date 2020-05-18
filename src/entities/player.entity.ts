import { DeckEntity } from './deck.entity';
import { GameEntity } from './game.entity';
import { Player } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'players' })
export class PlayerEntity extends Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  energy: number;

  @Column()
  lifePoint: number;

  @Column()
  lastViewedAt: Date;

  @OneToOne(
    () => DeckEntity,
    deckEntity => deckEntity.player,
  )
  deck: DeckEntity;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.players,
  )
  game: GameEntity;
}
