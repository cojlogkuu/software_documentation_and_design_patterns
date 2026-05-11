import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class NycViolation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  plate: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  licenseType: string;

  @Column({ nullable: true })
  issueDate: string;

  @Column({ nullable: true })
  violationTime: string;

  @Column({ nullable: true })
  violation: string;

  @Column('float', { nullable: true })
  fineAmount: number;
}
