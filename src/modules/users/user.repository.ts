import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RepositoryService } from 'src/core/repository/abstract.repository';

@Injectable()
export class UserRepositoryService extends RepositoryService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super();
  }

  protected get repository(): Repository<User> {
    return this.userRepo;
  }

}