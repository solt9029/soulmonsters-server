import { DeckEntity } from './deck.entity';
import { GameEntity } from './game.entity';
import { Player } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity({ name: 'players' })
@Unique(['userId', 'game'])
@Unique(['deck', 'game'])
export class PlayerEntity extends Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  energy: number;

  @Column({ default: 8000 })
  lifePoint: number;

  @Column()
  lastViewedAt: Date;

  @ManyToOne(
    () => DeckEntity,
    deckEntity => deckEntity.players,
  )
  deck: DeckEntity;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.players,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;
}
