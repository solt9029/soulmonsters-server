import { Game, Phase, Status } from './../graphql/index';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'games' })
export class GameEntity extends Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstUserId: string;

  @Column({ nullable: true })
  secondUserId: string;

  @Column({ nullable: true })
  playingUserId: string;

  @Column({ nullable: true })
  phase: Phase;

  @Column({ nullable: true })
  winningUserId: string;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @Column()
  status: Status;
}
