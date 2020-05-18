import { PlayerEntity } from './player.entity';
import { Game, Phase, Status, PlayingUser } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'games' })
export class GameEntity extends Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstUserId: string;

  @Column({ nullable: true })
  secondUserId: string;

  @Column({ nullable: true })
  playingUser: PlayingUser;

  @Column({ default: Phase.DRAW })
  phase: Phase;

  @Column({ nullable: true })
  winningUserId: string;

  @Column({ default: Status.WAIT })
  status: Status;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PlayerEntity,
    playerEntity => playerEntity.game,
  )
  players: PlayerEntity[];
}
