import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { ProjectRepositoryService } from './projects.repository';
import { CurrentUser } from '../auth/entities/current.user.entity';
import { DEFAULT_PAGE_SIZE } from 'src/core/constants/constants';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepositoryService: ProjectRepositoryService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    creator: CurrentUser,
  ): Promise<Project> {
    const newProjectData = {
      ...createProjectDto,
      creatorId: creator.id,
      status: ProjectStatus.PENDING,
    };
    try {
      return await this.projectRepositoryService.create(newProjectData);
    } catch (error) {
      throw new ConflictException('Error creating project: ' + error.message);
    }
  }

  async findAll(options?: Partial<Project>): Promise<Project[]> {
    return this.projectRepositoryService.findAll({
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

    const data = await this.projectRepositoryService.findAll(queryOptions);
    const total = await this.projectRepositoryService.count({
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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepositoryService.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    if (project.isBanned) {
      throw new ConflictException('Cannot update a banned project');
    }
    return this.projectRepositoryService.update(id, updateProjectDto);
  }

  async banProject(id: string, banNote: string): Promise<Project> {
    const project = await this.findOne(id);
    if (project.isBanned) {
      throw new ConflictException('Project is already banned');
    }
    return this.projectRepositoryService.update(id, {
      isBanned: true,
      banNote,
    });
  }

  async remove(id: string): Promise<void> {
    await this.projectRepositoryService.remove(id);
  }

  incrementVotes(id: string, voteWeight: number) {
    return this.projectRepositoryService.incrementVotes(id, voteWeight);
  }
}
