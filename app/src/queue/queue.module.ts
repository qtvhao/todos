import { BullModule } from '@nestjs/bull';
import { 
    QueueProcessor,
} from './queue.processor';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'password';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-prompt-queue',
      url: `redis://${REDIS_PASSWORD}@${REDIS_HOST}:6379`,
    }),
  ],
  exports: [QueueService],
  providers: [QueueProcessor, QueueService],
})
export class QueueModule {}
