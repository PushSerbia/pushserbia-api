import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { RepositoryService } from '../../core/repository/repository.service';

@Injectable()
export class ProjectRepositoryService extends RepositoryService<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {
    super();
  }

  protected get repository(): Repository<Project> {
    return this.projectRepo;
  }
}
