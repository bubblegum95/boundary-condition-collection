import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Weather from './weather.entity';

@Entity({ name: 'observatory' })
export class Observatory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  name: string;

  @Column({ type: 'int', nullable: false })
  num: number;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  code: string;

  @Column({ type: 'fixed', nullable: false })
  lat: number;

  @Column({ type: 'fixed', nullable: false })
  lng: number;

  @OneToOne(() => Weather, (weather) => weather.observatory)
  weather: Weather;
}
