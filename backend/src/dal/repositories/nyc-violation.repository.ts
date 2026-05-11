import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NycViolation } from '../entities/nyc-violation.entity';
import { INycViolationRepository } from '../interfaces/i-nyc-violation.repository';

@Injectable()
export class NycViolationRepository implements INycViolationRepository {
  constructor(
    @InjectRepository(NycViolation)
    private readonly repo: Repository<NycViolation>,
  ) {}

  async saveViolations(violations: NycViolation[]): Promise<NycViolation[]> {
    return this.repo.save(violations);
  }

  async getAllViolations(): Promise<NycViolation[]> {
    return this.repo.find({ order: { id: 'DESC' }, take: 100 });
  }
}
