import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
@Injectable()
export class QueueProcessor {
    constructor(private readonly queues: Queue[]) {
        if (this.queues.length === 0) {
            throw new Error('No queues have been initialized');
        }
        console.log('QueueProcessor initialized with queues:', this.queues.map((q) => q.name));
        this.queues.forEach((queue) => { queue.on('completed', (job) => this.onCompleted(job)); });
        // this.queues.forEach((queue) => { queue.process((job) => this.process(job)); });
    }
    async process(job: any) {
        console.log('Processing job:', job.data);
        return { result: 'success' };
    }
    onCompleted(job: any) {
        console.log('Job completed with result', job.returnvalue);
    }
}
