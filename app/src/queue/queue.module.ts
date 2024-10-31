import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { Queue } from 'bull';

const BULL_QUEUE_NAMES = (process.env.BULL_QUEUE_NAME || 'queue').split(',');
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
const REDIS_PORT = process.env.REDIS_PORT || '6389';

// Construct Redis URL
let redisUrl = `redis://${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
if (!REDIS_PASSWORD) {
  redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`;
}

@Module({
  imports: [
    ...BULL_QUEUE_NAMES.map(queueName =>
      BullModule.registerQueue({
        name: queueName,
        url: redisUrl,
      }),
    ),
  ],
  providers: [
    QueueProcessor,
    {
      provide: QueueService,
      useFactory: (...queues: Queue[]) => new QueueService(queues),
      inject: BULL_QUEUE_NAMES.map(queueName => `BullQueue_${queueName}`),
    },
  ],
  exports: [QueueService],
})
export class QueueModule {}
