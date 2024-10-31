import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(private readonly queues: Queue[]) {
    if (this.queues.length === 0) {
      throw new Error('No queues have been initialized');
    }
  }
  getQueues() {
    return this.queues;
  }

  private djb2Code(str: string) {
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

    const jobDataString = JSON.stringify(jobData);
    const queueIndex = this.djb2Code(jobDataString) % this.queues.length;
    const selectedQueue = this.queues[queueIndex];

    console.log(`Adding job with data: ${jobDataString} to queue: ${selectedQueue.name}`);

    return await selectedQueue.add(jobData);
  }
}