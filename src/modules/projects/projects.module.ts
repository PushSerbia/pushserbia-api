import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { ProjectRepositoryService } from './projects.repository';
import { BullModule } from '@nestjs/bullmq';
import {
  VOTE_CREATED_EVENT,
  VoteCreatedProcessor,
} from './processors/vote-created.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
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
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepositoryService, VoteCreatedProcessor],
  exports: [ProjectsService, BullModule],
})
export class ProjectsModule {}
