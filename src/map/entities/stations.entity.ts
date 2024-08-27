import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pollutions } from './pollutions.entity';

@Entity({ name: 'stations' })
export class Stations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 50, unique: true })
  // @Index('station_name_index')
  stationName: string;

  @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
  addr: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: false,
  })
  dmX: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: false,
  })
  dmY: number;

  @OneToOne(() => Pollutions, (pollutions) => pollutions.stations, {
    eager: true,
  })
  pollutions: Pollutions;
}
