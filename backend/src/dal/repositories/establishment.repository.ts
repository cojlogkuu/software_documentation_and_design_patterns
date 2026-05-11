import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from '../entities/establishment.entity';
import { IEstablishmentRepository } from '../interfaces/i-establishment.repository';

@Injectable()
export class EstablishmentRepository implements IEstablishmentRepository {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepo: Repository<Establishment>,
  ) {}

  async saveEstablishments(establishments: Establishment[]): Promise<Establishment[]> {
    return this.establishmentRepo.save(establishments);
  }

  async getAllEstablishments(): Promise<Establishment[]> {
    return this.establishmentRepo.find();
  }

  async getByName(name: string): Promise<Establishment | null> {
    return this.establishmentRepo.findOne({ where: { name } });
  }

  async getById(id: number): Promise<Establishment | null> {
    return this.establishmentRepo.findOne({ where: { placeId: id } });
  }

  async create(establishment: Partial<Establishment>): Promise<Establishment> {
    const newEst = this.establishmentRepo.create(establishment);
    return this.establishmentRepo.save(newEst);
  }

  async update(id: number, establishment: Partial<Establishment>): Promise<Establishment> {
    await this.establishmentRepo.update(id, establishment);
    return this.getById(id) as Promise<Establishment>;
  }

  async delete(id: number): Promise<void> {
    await this.establishmentRepo.delete(id);
  }
}
