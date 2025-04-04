import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VotesService } from './votes.service';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CurrentUser } from '../auth/entities/current.user.entity';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get('my-votes')
  getMyVotes(@GetUser() user: CurrentUser) {
    return this.votesService.fetchAll({
      where: { userId: user.id },
    });
  }

  @Post()
  async create(
    @Body() createVoteDto: CreateVoteDto,
    @GetUser() user: CurrentUser,
  ) {
    return await this.votesService.voteForProject({
      userId: user.id,
      projectId: createVoteDto.projectId,
    });
  }

  @Get(':projectId/count')
  async getProjectVoteCount(@Param('projectId') projectId: number) {
    const voteCount = await this.votesService.getProjectVoteCount(projectId);
    return { projectId, voteCount };
  }
}
