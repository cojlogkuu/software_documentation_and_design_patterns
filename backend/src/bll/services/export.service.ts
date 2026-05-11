import { Injectable, Inject } from '@nestjs/common';
import { IExportStrategy } from '../strategies/i-export-strategy';
import { ConsoleStrategy } from '../strategies/console.strategy';
import { RedisStrategy } from '../strategies/redis.strategy';
import { KafkaStrategy } from '../strategies/kafka.strategy';
import { DatabaseStrategy } from '../strategies/database.strategy';
import { INycViolationRepositoryToken } from '../../dal/interfaces/i-nyc-violation.repository';
import type { INycViolationRepository } from '../../dal/interfaces/i-nyc-violation.repository';
import { config } from '../../config';

@Injectable()
export class ExportService {
  constructor(
    @Inject(INycViolationRepositoryToken)
    private readonly violationRepo: INycViolationRepository,
  ) {}

  /**
   * The Context method for executing the Strategy Pattern.
   */
  async executeExport(strategyType: string): Promise<{ message: string }> {
    // 1. Fetch data from Socrata
    const url = 'https://data.cityofnewyork.us/resource/nc67-uf89.json?$limit=100';
    let dataset: any[] = [];
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      dataset = await response.json();
    } catch (err) {
      console.error('Failed to fetch dataset:', err);
      throw new Error('Failed to fetch data from NYC Socrata API.');
    }

    // 2. Determine Strategy (Factory logic)
    let activeType = strategyType.toUpperCase();
    if (activeType === 'CONFIG') {
      activeType = config.EXPORT_STRATEGY.toUpperCase();
    }

    let strategy: IExportStrategy;

    switch (activeType) {
      case 'CONSOLE':
        strategy = new ConsoleStrategy();
        break;
      case 'REDIS':
        strategy = new RedisStrategy();
        break;
      case 'KAFKA':
        strategy = new KafkaStrategy();
        break;
      case 'DATABASE':
        // The DatabaseStrategy needs the repository injected to persist data
        strategy = new DatabaseStrategy(this.violationRepo);
        break;
      default:
        strategy = new ConsoleStrategy();
        activeType = 'CONSOLE (Fallback)';
    }

    // 3. Execute Context
    await strategy.export(dataset);

    return { message: `Successfully executed export using strategy: ${activeType}` };
  }

  async getAllViolations() {
    return this.violationRepo.getAllViolations();
  }
}
