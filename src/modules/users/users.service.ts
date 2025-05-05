import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RepositoryService } from '../../core/repository/repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends RepositoryService<User> {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
  ) {
    super();
  }

  incrementProjectsProposed(userId: string) {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        projectsProposed: () => 'projectsProposed + 1',
      })
      .where('id = :userId', { userId })
      .execute();
  }

  incrementProjectsSupported(userId: string) {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        projectsSupported: () => 'projectsSupported + 1',
      })
      .where('id = :userId', { userId })
      .execute();
  }
}
