import { 
  BullModule,
} from '@nestjs/bull';
import { 
    QueueProcessor,
} from './queue.processor';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'queue';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
const REDIS_PORT = process.env.REDIS_PORT || '6389';
// 
let url = `redis://${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;
if (REDIS_PASSWORD.length === 0) {
  url = `redis://${REDIS_HOST}:${REDIS_PORT}`;
}
@Module({
  imports: [
    BullModule.registerQueue({
      name: BULL_QUEUE_NAME,
      url,
    }),
  ],
  exports: [QueueService],
  providers: [QueueProcessor, QueueService],
})
export class QueueModule {}
