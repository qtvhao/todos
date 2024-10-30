import { Injectable } from '@nestjs/common';
import { Processor, Process, OnQueueCompleted } from '@nestjs/bull';

const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'queue';
@Injectable()
@Processor('BULL_QUEUE_NAME')

export class QueueProcessor {
    @Process()
    async process(job: any) {
        // await new Promise((resolve) => setTimeout(resolve, 1_000));
        // console.log('Processing job', job.id);
        let jobData = job.data;
        console.log('Job data:', jobData);
        return job.data;
    }
}
