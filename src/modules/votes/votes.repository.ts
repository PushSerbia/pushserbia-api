import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { RepositoryService } from 'src/core/repository/abstract.repository';

@Injectable()
export class VoteRepositoryService extends RepositoryService<Vote> {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {
    super();
  }

  protected get repository(): Repository<Vote> {
    return this.voteRepo;
  }
}