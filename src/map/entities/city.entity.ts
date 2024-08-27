import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'city' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 6 })
  sidoName: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  gunName: string;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  guName: string;

  @Column({ type: 'int', nullable: false })
  code: number;
}
