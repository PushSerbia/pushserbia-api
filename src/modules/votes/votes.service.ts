import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { User } from '../users/entities/user.entity';
import { Vote } from './entities/vote.entity';
import { VoteRepositoryService } from './votes.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class VotesService {
  constructor(
    private readonly voteRepositoryService: VoteRepositoryService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async voteForProject(user: User, projectId: string): Promise<Vote> {
    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    if (project.isBanned) {
      throw new ConflictException('Cannot vote for a banned project');
    }
    const existingVote = await this.voteRepositoryService.findOneBy({
      user: { id: user.id } as any,
      project: { id: projectId } as any,
    });
    if (existingVote) {
      throw new ConflictException('User has already voted for this project');
    }
    const userData = await this.usersService.findOneBy({ id: user.id });
    if (!userData) {
      throw new NotFoundException(`User not found`);
    }
    const voteData = { userId: user.id, projectId, weight: userData.level };
    return this.voteRepositoryService.create(voteData);
  }

  async getProjectVoteCount(projectId: number): Promise<number> {
    const votes = await this.voteRepositoryService.findAll({
      where: { project: { id: projectId } },
    });
    return votes.reduce((sum, vote) => sum + vote.weight, 0);
  }

  fetchAll(params: object) {
    return this.voteRepositoryService.findAll(params);
  }
}
