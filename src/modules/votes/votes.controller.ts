import { Body, Controller, Get, Post } from '@nestjs/common';
import { VotesService } from './votes.service';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CurrentUser } from '../auth/entities/current.user.entity';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get('my-votes')
  getMyVotes(@GetUser() user: CurrentUser) {
    return this.votesService.findAll({
      where: { userId: user.id },
    });
  }

  @Post()
  async create(
    @Body() createVoteDto: CreateVoteDto,
    @GetUser() user: CurrentUser,
  ) {
    return this.votesService.voteForProject({
      userId: user.id,
      projectId: createVoteDto.projectId,
    });
  }
}
