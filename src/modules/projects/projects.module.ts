import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { VoteCreatedProcessor } from './processors/vote-created.processor';
import { ProjectSubscriber } from './subscribers/project.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [ProjectsService, VoteCreatedProcessor, ProjectSubscriber],
  exports: [ProjectsService],
})
export class ProjectsModule {}
