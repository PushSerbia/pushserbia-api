import { BadRequestException, Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { DEFAULT_PAGE_SIZE } from '../../core/constants/constants';
import { RepositoryService } from '../../core/repository/repository.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService extends RepositoryService<Project> {
  constructor(
    @InjectRepository(Project)
    protected readonly repository: Repository<Project>,
  ) {
    super();
  }

  async findAll(options?: Partial<Project>): Promise<Project[]> {
    return this.repository.find({
      where: { ...options, isBanned: false },
      relations: ['creator'],
    });
  }

  async findAllOffset(
    options?: Partial<Project>,
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
  ): Promise<{
    data: Project[];
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
  }> {
    if (limit < 1) {
      throw new BadRequestException('Limit must be at least 1');
    }
    if (offset < 0) {
      throw new BadRequestException('Offset must be non-negative');
    }

    const queryOptions: any = {
      where: { ...options, isBanned: false },
      order: { id: 'ASC' },
      take: limit,
      skip: offset,
      relations: ['creator'],
    };

    const data = await this.repository.find(queryOptions);
    const total = await this.repository.count({
      where: { ...options, isBanned: false },
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
    const currentPage = total > 0 ? Math.floor(offset / limit) + 1 : 0;

    return {
      data,
      total,
      limit,
      offset,
      currentPage,
      totalPages,
    };
  }

  incrementVotes(id: string, voteWeight: number) {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        totalVotes: () => 'totalVotes + :voteWeight',
        totalVoters: () => 'totalVoters + 1',
      })
      .where('id = :id', { id, voteWeight })
      .execute();
  }
}
