import { Card, Kind, Type, Attribute } from './../graphql/index';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cards' })
export class CardEntity extends Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  kind: Kind;

  @Column()
  type: Type;

  @Column()
  attribute: Attribute;

  @Column()
  attack: number;

  @Column()
  defence: number;

  @Column()
  cost: number;

  @Column()
  detail: string;

  @Column()
  picture: string;
}
