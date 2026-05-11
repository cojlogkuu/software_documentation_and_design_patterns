import { IExportStrategy } from './i-export-strategy';
import Redis from 'ioredis';

export class RedisStrategy implements IExportStrategy {
  async export(data: any[]): Promise<void> {
    console.log(`\n[RedisStrategy] Connecting to Redis and exporting ${data.length} records...`);
    const redis = new Redis({
      host: 'localhost',
      port: 6379,
    });

    try {
      await redis.set('nyc_violations_data', JSON.stringify(data));
      console.log('[RedisStrategy] Export complete. Data saved to key: "nyc_violations_data"\n');
    } catch (error) {
      console.error('[RedisStrategy] Error exporting to Redis:', error);
    } finally {
      redis.disconnect();
    }
  }
}
