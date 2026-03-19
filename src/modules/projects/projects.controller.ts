import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { CurrentUser } from '../auth/entities/current.user.entity';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../core/constants/constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role';
import { RolesGuard } from '../auth/guards/roles.guard';
import { generateGravatar } from '../../core/utils/generate-gravatar';

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
    };
    const project = await this.projectsService.create(newProjectData);
    return {
      ...project,
      creator: {
        id: creator.id,
        fullName: creator.name,
        gravatar: generateGravatar(creator.email),
      },
    };
  }

  @Get()
  findAll(
    @Query('slug') slug: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const _pageSize = Math.min(
      pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const _page =
      page && Number(page) > 0 ? Number(page) : DEFAULT_PAGE_NUMBER;
    const offset = (_page - 1) * _pageSize;

    return this.projectsService.findAllOffset(
      slug ? { slug } : undefined,
      _pageSize,
      offset,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: CurrentUser,
  ) {
    const criteria =
      user.role === UserRole.Admin ? { id } : { id, creatorId: user.id };
    const project = await this.projectsService.update(
      criteria,
      updateProjectDto,
    );
    return {
      ...project,
      creator: {
        id: user.id,
        fullName: user.name,
        gravatar: generateGravatar(user.email),
      },
    };
  }

  @Patch(':id/ban')
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  banProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('banNote') banNote: string,
  ) {
    return this.projectsService.update(id, { isBanned: true, banNote });
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: CurrentUser,
  ) {
    const criteria =
      user.role === UserRole.Admin ? { id } : { id, creatorId: user.id };
    return this.projectsService.remove(criteria);
  }
}
