import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'profile', name: 'students' })
export class StudentEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;
}
