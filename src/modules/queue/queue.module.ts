import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { USER_PROPOSED_PROJECT_EVENT } from '../users/processors/user-proposed-project.processor';
import { USER_SUPPORTED_PROJECT_EVENT } from '../users/processors/user-supported-project.processor';
import { VOTE_CREATED_EVENT } from '../projects/processors/vote-created.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: USER_PROPOSED_PROJECT_EVENT,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({
      name: USER_SUPPORTED_PROJECT_EVENT,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({
      name: VOTE_CREATED_EVENT,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
