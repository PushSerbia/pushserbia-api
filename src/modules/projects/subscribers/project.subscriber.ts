import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Project } from '../entities/project.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  USER_PROPOSED_PROJECT_EVENT,
  UserProposedProjectEvent,
} from '../../users/processors/user-proposed-project.processor';

@EventSubscriber()
export class ProjectSubscriber implements EntitySubscriberInterface<Project> {
  constructor(
    dataSource: DataSource,
    @InjectQueue(USER_PROPOSED_PROJECT_EVENT) private eventQueue: Queue,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Project;
  }

  async afterInsert(event: InsertEvent<Project>) {
    const data: UserProposedProjectEvent = {
      userId: event.entity.creatorId,
    };
    await this.eventQueue.add(USER_PROPOSED_PROJECT_EVENT, data);
  }
}
