import { Controller, Get, Param, Post } from '@nestjs/common';
import { VotesService } from './votes.service';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get('my-votes')
  getMyVotes(@GetUser() user: User) {
    return this.votesService.fetchAll({
      where: { userId: user.id },
    });
  }

  @Post(':projectId')
  async voteForProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.votesService.voteForProject(user, projectId);
  }

  @Get(':projectId/count')
  async getProjectVoteCount(@Param('projectId') projectId: number) {
    const voteCount = await this.votesService.getProjectVoteCount(projectId);
    return { projectId, voteCount };
  }
}
