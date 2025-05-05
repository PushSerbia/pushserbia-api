import { UsersService } from '../users.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface UserProposedProjectEvent {
  userId: string;
}

export const USER_PROPOSED_PROJECT_EVENT = 'user-proposed-project-event';

@Processor(USER_PROPOSED_PROJECT_EVENT)
export class UserProposedProjectProcessor extends WorkerHost {
  constructor(private usersService: UsersService) {
    super();
  }

  async process(job: Job<UserProposedProjectEvent>) {
    await this.usersService.incrementProjectsProposed(job.data.userId);
  }
}
