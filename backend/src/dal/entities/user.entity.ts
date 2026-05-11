import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, ChildEntity } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'userType' } })
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;
}

@ChildEntity('visitor')
export class Visitor extends User {}

@ChildEntity('owner')
export class Owner extends User {}

@ChildEntity('admin')
export class Admin extends User {}
