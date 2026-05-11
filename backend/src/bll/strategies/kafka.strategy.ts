import { IExportStrategy } from './i-export-strategy';
import { Kafka } from 'kafkajs';

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
