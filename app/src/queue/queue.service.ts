import { Injectable } from '@nestjs/common';
import {
    InjectQueue,
} from '@nestjs/bull';

const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'queue';
@Injectable()
export class QueueService {
    constructor( @InjectQueue(BULL_QUEUE_NAME) private readonly queue: any) {}
    async addJob(job: any) {
        return this.queue.add(job);
    }
}
