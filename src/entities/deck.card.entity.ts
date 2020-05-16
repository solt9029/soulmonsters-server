import { DeckEntity } from './deck.entity';
import { CardEntity } from './card.entity';
import { DeckCard } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity({ name: 'deckCards' })
@Unique(['card', 'deck'])
export class DeckCardEntity extends DeckCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  count: number;

  @ManyToOne(
    () => CardEntity,
    cardEntity => cardEntity.deckCards,
    { primary: true },
  )
  card: CardEntity;

  @ManyToOne(
    () => DeckEntity,
    deckEntity => deckEntity.deckCards,
    { primary: true },
  )
  deck: DeckEntity;
}
