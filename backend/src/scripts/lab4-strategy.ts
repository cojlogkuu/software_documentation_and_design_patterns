import { config } from '../config';
import Redis from 'ioredis';
import { Kafka } from 'kafkajs';

export interface IExportStrategy {
  export(data: any[]): Promise<void>;
}

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

export class KafkaStrategy implements IExportStrategy {
  async export(data: any[]): Promise<void> {
    console.log(`\n[KafkaStrategy] Connecting to Kafka and exporting ${data.length} records...`);
    const kafka = new Kafka({
      clientId: 'lab4-strategy-app',
      brokers: ['localhost:9092'],
    });

    const producer = kafka.producer();

    try {
      await producer.connect();
      const messages = data.map((record) => ({
        value: JSON.stringify(record),
      }));

      await producer.send({
        topic: 'nyc-violations',
        messages: messages,
      });

      console.log('[KafkaStrategy] Export complete. Data published to topic: "nyc-violations"\n');
    } catch (error) {
      console.error('[KafkaStrategy] Error exporting to Kafka:', error);
    } finally {
      await producer.disconnect();
    }
  }
}

export class DataExporter {
  private strategy: IExportStrategy;

  constructor(strategy: IExportStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IExportStrategy) {
    this.strategy = strategy;
  }

  public async exportData(data: any[]): Promise<void> {
    await this.strategy.export(data);
  }
}

async function main() {
  console.log('=== Starting Lab 4: Strategy Pattern ===\n');

  const url = 'https://data.cityofnewyork.us/resource/nc67-uf89.json?$limit=100';
  console.log(`[Main] Fetching dataset from: ${url}`);
  
  let dataset: any[] = [];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    dataset = await response.json();
    console.log(`[Main] Successfully fetched ${dataset.length} records.\n`);
  } catch (err) {
    console.error('[Main] Failed to fetch dataset:', err);
    return;
  }

  let strategy: IExportStrategy;
  const activeStrategy = config.EXPORT_STRATEGY;
  
  console.log(`[Main] Active Strategy from config.ts: ${activeStrategy}`);
  
  switch (activeStrategy.toUpperCase()) {
    case 'CONSOLE':
      strategy = new ConsoleStrategy();
      break;
    case 'REDIS':
      strategy = new RedisStrategy();
      break;
    case 'KAFKA':
      strategy = new KafkaStrategy();
      break;
    default:
      console.warn(`[Main] Unknown strategy "${activeStrategy}", falling back to CONSOLE.`);
      strategy = new ConsoleStrategy();
  }

  const exporter = new DataExporter(strategy);
  await exporter.exportData(dataset);
  
  console.log('=== Lab 4 Execution Finished ===');
}

main().catch(console.error);
