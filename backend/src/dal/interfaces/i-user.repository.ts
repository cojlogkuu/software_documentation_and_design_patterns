import { Visitor } from '../entities/user.entity';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  saveVisitors(visitors: Visitor[]): Promise<Visitor[]>;
  getAllVisitors(): Promise<Visitor[]>;
}
