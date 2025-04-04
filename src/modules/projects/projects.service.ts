import {
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
      creator,
      status: ProjectStatus.PENDING,
      shareableLink: uuidv4(), //random za sada
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
}
