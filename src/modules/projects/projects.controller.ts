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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: CurrentUser,
  ) {
    return await this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll(@Query('slug') slug: string) {
    return this.projectsService.findAll(slug ? { slug } : undefined);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectsService.update(id, updateProjectDto);
  }

  @Patch(':id/ban')
  async banProject(@Param('id') id: string, @Body('banNote') banNote: string) {
    return await this.projectsService.banProject(id, banNote);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}
