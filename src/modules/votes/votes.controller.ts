import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { AuthGuard } from '../../core/guards/auth/auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(AuthGuard)
  @Post(':projectId')
  async voteForProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: User,
  ) {
    return await this.votesService.voteForProject(user, projectId);
  }

  @Get(':projectId/count')
  async getProjectVoteCount(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const voteCount = await this.votesService.getProjectVoteCount(projectId);
    return { projectId, voteCount };
  }
}
