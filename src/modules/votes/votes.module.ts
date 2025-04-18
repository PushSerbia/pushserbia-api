import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { VoteSubscriber } from './subscribers/vote.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), ProjectsModule, UsersModule],
  controllers: [VotesController],
  providers: [VotesService, VoteSubscriber],
  exports: [VotesService],
})
export class VotesModule {}
