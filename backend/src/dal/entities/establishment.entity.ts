import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, ChildEntity } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Establishment {
  @PrimaryGeneratedColumn()
  placeId: number;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column('float', { default: 0 })
  averageRating: number;
}

@ChildEntity('Hotel')
export class Hotel extends Establishment {
  @Column('int', { nullable: true })
  stars: number;
}

@ChildEntity('Restaurant')
export class Restaurant extends Establishment {
  @Column({ nullable: true })
  cuisineType: string;
}
