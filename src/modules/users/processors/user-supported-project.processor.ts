import { UsersService } from '../users.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface UserSupportedProjectEvent {
  userId: string;
}

export const USER_SUPPORTED_PROJECT_EVENT = 'user-supported-project-event';

@Processor(USER_SUPPORTED_PROJECT_EVENT)
export class UserSupportedProjectProcessor extends WorkerHost {
  constructor(private usersService: UsersService) {
    super();
  }

  async process(job: Job<UserSupportedProjectEvent>) {
    await this.usersService.incrementProjectsSupported(job.data.userId);
  }
}
