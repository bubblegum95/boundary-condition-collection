import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stations } from './stations.entity';

@Entity({ name: 'pollutions' })
export class Pollutions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationId: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  stationName: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  dataTime: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  sidoName: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  pm10Value: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  pm10Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  pm25Value: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  pm25Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  no2Value: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  no2Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  o3Value: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  o3Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  so2Value: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  so2Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  coValue: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  coGrade: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Stations, (stations) => stations.pollutions)
  @JoinColumn({ name: 'id' })
  stations: Stations;
}
