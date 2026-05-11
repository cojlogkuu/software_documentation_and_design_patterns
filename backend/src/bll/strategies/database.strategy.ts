import { IExportStrategy } from './i-export-strategy';
import { INycViolationRepository } from '../../dal/interfaces/i-nyc-violation.repository';
import { NycViolationAdapter } from '../adapters/nyc-violation.adapter';

export class DatabaseStrategy implements IExportStrategy {
  constructor(private readonly violationRepo: INycViolationRepository) {}

  async export(data: any[]): Promise<void> {
    console.log(`\n[DatabaseStrategy] Adapting and saving ${data.length} records to Postgres DB...`);
    
    // Apply Adapter Pattern to transform raw JSON to Entity format
    const adaptedEntities = data.map((item) => NycViolationAdapter.adapt(item));
    
    // Save to Database
    await this.violationRepo.saveViolations(adaptedEntities);
    
    console.log('[DatabaseStrategy] Export complete. Data saved to Database.\n');
  }
}
