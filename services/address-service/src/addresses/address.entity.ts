import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'address', name: 'addresses' })
export class AddressEntity {
  @PrimaryColumn({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @Column({ type: 'text' })
  address!: string;
}
