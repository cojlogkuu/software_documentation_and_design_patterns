import { Controller, Post } from '@nestjs/common';
import { SeederService } from '../../bll/services/seeder.service';
import { ISeederController } from '../interfaces/i-seeder.controller';

@Controller('seeder')
export class SeederController implements ISeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  async seed(): Promise<string> {
    await this.seederService.seedDatabase('dataset.csv');
    return 'Database seeded successfully';
  }
}
