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
}
