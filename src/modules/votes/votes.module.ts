import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { ProjectsModule } from '../projects/projects.module';
import { VoteRepositoryService } from './votes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), ProjectsModule],
  controllers: [VotesController],
  providers: [VotesService, VoteRepositoryService],
  exports: [VotesService],
})
export class VotesModule {}