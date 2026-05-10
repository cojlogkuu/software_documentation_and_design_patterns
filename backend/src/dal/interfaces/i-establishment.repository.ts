import { Establishment } from '../entities/establishment.entity';

export const IEstablishmentRepositoryToken = Symbol('IEstablishmentRepository');

export interface IEstablishmentRepository {
  saveEstablishments(establishments: Establishment[]): Promise<Establishment[]>;
  getAllEstablishments(): Promise<Establishment[]>;
}
