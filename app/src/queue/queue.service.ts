import { Injectable } from '@nestjs/common';
import {
    InjectQueue,
} from '@nestjs/bull';
import { Queue } from 'bull';

const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'queue';
const BULL_QUEUE_NAMES = BULL_QUEUE_NAME.split(',');
@Injectable()
export class QueueService {
    private queues: any;

    constructor (
        @InjectQueue(BULL_QUEUE_NAME) private readonly queue: Queue,
    ) {
        console.log('Class of queue:', this.queue, ' is ', this.queue.constructor.name);
    }
    djb2Code(str: string) { // DJB2 hash function
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        return hash >>> 0;
    }
    async addJob(jobData: any) {
        if (this.queues.length === 0) {
            throw new Error('No queues are available');
        }
        console.log('Creating todo with job data:', jobData, ' in queues:', this.queues.map(queue => queue.name));
        let jobDataString = JSON.stringify(jobData); // stringify job data to get a consistent hash
        let queueIndex = Math.abs(this.djb2Code(jobDataString)) % this.queues.length;
        // consistent hashing to distribute jobs across multiple queues
        // and to ensure that the same job data always goes to the same queue 
        let queue = this.queues[queueIndex];
        console.log('Creating todo with job data:', jobData, 'in queue:', queue.name);
        return await queue.add(jobData);
    }
}
