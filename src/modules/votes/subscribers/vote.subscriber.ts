import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Vote } from '../entities/vote.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  VOTE_CREATED_EVENT,
  VoteCreatedEvent,
} from '../../projects/processors/vote-created.processor';
import {
  USER_SUPPORTED_PROJECT_EVENT,
  UserSupportedProjectEvent,
} from '../../users/processors/user-supported-project.processor';

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  constructor(
    dataSource: DataSource,
    @InjectQueue(VOTE_CREATED_EVENT) private eventQueue: Queue,
    @InjectQueue(USER_SUPPORTED_PROJECT_EVENT)
    private userSupportedProjectQueue: Queue,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vote;
  }

  async afterInsert(event: InsertEvent<Vote>) {
    const voteData: VoteCreatedEvent = {
      projectId: event.entity.projectId,
      userLevel: event.entity.weight,
    };
    await this.eventQueue.add(VOTE_CREATED_EVENT, voteData);

    const userData: UserSupportedProjectEvent = {
      userId: event.entity.userId,
    };
    await this.userSupportedProjectQueue.add(
      USER_SUPPORTED_PROJECT_EVENT,
      userData,
    );
  }
}
