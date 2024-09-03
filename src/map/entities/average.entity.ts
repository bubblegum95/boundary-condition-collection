import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'average' })
export class Average {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', array: true, nullable: false })
  cityCodes: number[];

  @Column({ type: 'varchar', nullable: false, length: 6 })
  cityName: string;

  @Column({ type: 'varchar', nullable: false, length: 6 })
  sidoName: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  dataTime: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  pm10Value: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  pm10Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  pm25Value: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  pm25Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  no2Value: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  no2Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 5 })
  o3Value: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  o3Grade: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  coValue: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  coGrade: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  so2Value: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  so2Grade: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
