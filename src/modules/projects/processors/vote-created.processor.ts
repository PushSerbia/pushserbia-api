import { ProjectsService } from '../projects.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export interface VoteCreatedEvent {
  projectId: string;
  userLevel: number;
}

export const VOTE_CREATED_EVENT = 'vote-created-event';

@Processor(VOTE_CREATED_EVENT)
export class VoteCreatedProcessor extends WorkerHost {
  constructor(private projectsService: ProjectsService) {
    super();
  }

  async process(job: Job<VoteCreatedEvent>) {
    await this.projectsService.incrementVotes(
      job.data.projectId,
      job.data.userLevel,
    );
  }
}
