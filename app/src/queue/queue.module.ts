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
// 
let url = `redis://${REDIS_PASSWORD}@${REDIS_HOST}:6389`;
if (REDIS_PASSWORD.length === 0) {
  url = `redis://${REDIS_HOST}:6389`;
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
