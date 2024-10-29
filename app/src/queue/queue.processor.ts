import { Injectable } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';

@Injectable()
@Processor('queue')

export class QueueProcessor {
    @Process('process')
    async process(job: any) {
        console.log('Processing job', job.id);
        return job.data;
    }
}
