import { GameEntity } from './game.entity';
import { CardEntity } from './card.entity';
import {
  Attribute,
  Kind,
  Type,
  Zone,
  BattlePosition,
  GameCard,
} from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'gameCards' })
export class GameCardEntity extends GameCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUserId: string;

  @Column()
  currentUserId: string;

  @Column()
  zone: Zone;

  @Column()
  position: number;

  @Column({ nullable: true })
  battlePosition: BattlePosition;

  @Column()
  name: string;

  @Column()
  kind: Kind;

  @Column()
  type: Type;

  @Column({ nullable: true })
  attribute: Attribute;

  @Column({ nullable: true })
  attack: number;

  @Column({ nullable: true })
  defence: number;

  @Column({ nullable: true })
  cost: number;

  @Column('text', { nullable: true })
  detail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => CardEntity,
    cardEntity => cardEntity.gameCards,
  )
  card: CardEntity;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameCards,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;
}
