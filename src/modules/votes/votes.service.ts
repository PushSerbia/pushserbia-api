import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../users/entities/user.entity';


@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    private readonly projectsService: ProjectsService,
  ) {}

  async voteForProject(user: User, projectId: number): Promise<Vote> {
    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    if (project.isBanned) {
      throw new ConflictException('Cannot vote for a banned project');
    }
    const existingVote = await this.voteRepository.findOne({
      where: { user: { id: user.id }, project: { id: projectId } },
    });
    if (existingVote) {
      throw new ConflictException('User has already voted for this project');
    }
    const vote = this.voteRepository.create({
      user,
      project,
      weight: user.level,
    });
    return await this.voteRepository.save(vote);
  }

  async getProjectVoteCount(projectId: number): Promise<number> {
    const votes = await this.voteRepository.find({ where: { project: { id: projectId } } });
    return votes.reduce((sum, vote) => sum + vote.weight, 0);
  }
}