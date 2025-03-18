import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, creator: User): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      creator,
      status: ProjectStatus.PENDING,
      shareableLink: uuidv4(), // random za sada
    });
    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new ConflictException('Error creating project: ' + error.message);
    }
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { isBanned: false },
      relations: ['creator'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
   
    if (project.isBanned) {
      throw new ConflictException('Cannot update a banned project');
    }
    Object.assign(project, updateProjectDto);
    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new ConflictException('Error updating project: ' + error.message);
    }
  }

  async banProject(id: number, banNote: string): Promise<Project> {
    const project = await this.findOne(id);
    if (project.isBanned) {
      throw new ConflictException('Project is already banned');
    }
    project.isBanned = true;
    project.banNote = banNote;
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}