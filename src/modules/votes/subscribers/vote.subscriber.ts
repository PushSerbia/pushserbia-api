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

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  constructor(
    dataSource: DataSource,
    @InjectQueue('project-events') private eventQueue: Queue,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vote;
  }

  async afterInsert(event: InsertEvent<Vote>) {
    const data: VoteCreatedEvent = {
      projectId: event.entity.projectId,
      userLevel: event.entity.weight,
    };
    await this.eventQueue.add(VOTE_CREATED_EVENT, data);
  }
}
