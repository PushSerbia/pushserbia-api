import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { CurrentUser } from '../auth/entities/current.user.entity';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from '../../core/constants/constants';
import { ProjectStatus } from './enums/project-status.enum';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() creator: CurrentUser,
  ) {
    const newProjectData = {
      ...createProjectDto,
      creatorId: creator.id,
      status: ProjectStatus.PENDING,
    };
    const project = await this.projectsService.create(newProjectData);
    return {
      ...project,
      creator: {
        id: creator.id,
        fullName: creator.name,
        imageUrl: creator.imageUrl,
      },
    };
  }

  @Get()
  findAll(
    @Query('slug') slug: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    if (page !== undefined || pageSize !== undefined) {
      const _pageSize = pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE;
      const _page =
        page && Number(page) > 0 ? Number(page) : DEFAULT_PAGE_NUMBER;
      const offset = (_page - 1) * _pageSize;

      return this.projectsService.findAllOffset(
        slug ? { slug } : undefined,
        _pageSize,
        offset,
      );
    }
    return this.projectsService.findAll(slug ? { slug } : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: CurrentUser,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return {
      ...project,
      creator: {
        id: user.id,
        fullName: user.name,
      },
    };
  }

  @Patch(':id/ban')
  banProject(@Param('id') id: string, @Body('banNote') banNote: string) {
    return this.projectsService.update(id, { isBanned: true, banNote });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
