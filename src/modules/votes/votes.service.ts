import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { Vote } from './entities/vote.entity';
import { UsersService } from '../users/users.service';
import { RepositoryService } from '../../core/repository/repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VotesService extends RepositoryService<Vote> {
  constructor(
    @InjectRepository(Vote)
    protected readonly repository: Repository<Vote>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async voteForProject(params: {
    userId: string;
    projectId: string;
  }): Promise<Vote> {
    const project = await this.projectsService.findById(params.projectId);
    if (!project) {
      throw new NotFoundException(
        `Project with id ${params.projectId} not found`,
      );
    }
    if (project.isBanned) {
      throw new ConflictException('Cannot vote for a banned project');
    }
    const existingVote = await this.repository.findOneBy(params);
    if (existingVote) {
      throw new ConflictException('User has already voted for this project');
    }
    const userData = await this.usersService.findOneBy({ id: params.userId });
    if (!userData) {
      throw new NotFoundException(`User not found`);
    }
    const voteData = { ...params, weight: userData.level };
    return this.repository.create(voteData);
  }
}
