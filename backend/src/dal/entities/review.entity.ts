import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Visitor } from './user.entity';
import { Establishment } from './establishment.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column('text')
  text: string;

  @Column('int')
  rating: number;

  @Column()
  date: Date;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(() => Visitor)
  visitor: Visitor;

  @ManyToOne(() => Establishment, { onDelete: 'CASCADE' })
  establishment: Establishment;
}
