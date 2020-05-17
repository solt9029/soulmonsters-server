import { DeckCardEntity } from './deck.card.entity';
import { Deck } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'decks' })
export class DeckEntity extends Deck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: string;

  @Column({ length: 64 })
  name!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => DeckCardEntity,
    deckCardEntity => deckCardEntity.card,
  )
  deckCards: DeckCardEntity[];
}
