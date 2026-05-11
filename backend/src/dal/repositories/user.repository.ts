import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/i-user.repository';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
  ) {}

  async saveVisitors(visitors: Visitor[]): Promise<Visitor[]> {
    return this.visitorRepository.save(visitors);
  }

  async getAllVisitors(): Promise<Visitor[]> {
    return this.visitorRepository.find();
  }
}
