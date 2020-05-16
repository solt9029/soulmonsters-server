import { Deck } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
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
}
