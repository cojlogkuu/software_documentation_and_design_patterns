import { Establishment } from '../entities/establishment.entity';

export const IEstablishmentRepositoryToken = Symbol('IEstablishmentRepository');

export interface IEstablishmentRepository {
  saveEstablishments(establishments: Establishment[]): Promise<Establishment[]>;
  getAllEstablishments(): Promise<Establishment[]>;
  getByName(name: string): Promise<Establishment | null>;
  getById(id: number): Promise<Establishment | null>;
  create(establishment: Partial<Establishment>): Promise<Establishment>;
  update(id: number, establishment: Partial<Establishment>): Promise<Establishment>;
  delete(id: number): Promise<void>;
}
