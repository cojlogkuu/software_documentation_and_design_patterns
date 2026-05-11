import { IExportStrategy } from './i-export-strategy';

export class ConsoleStrategy implements IExportStrategy {
  async export(data: any[]): Promise<void> {
    console.log(`\n[ConsoleStrategy] Exporting ${data.length} records to console:`);
    console.log(JSON.stringify(data.slice(0, 2), null, 2));
    if (data.length > 2) {
      console.log(`... and ${data.length - 2} more records.`);
    }
    console.log('[ConsoleStrategy] Export complete.\n');
  }
}
