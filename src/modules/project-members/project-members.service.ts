import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Vote } from '../votes/entities/vote.entity';
import { UserRole } from '../users/enums/user-role';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly repository: Repository<ProjectMember>,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async addMember(params: {
    projectId: string;
    userId: string;
    currentUserId: string;
    currentUserRole: UserRole;
  }): Promise<ProjectMember> {
    const project = await this.projectRepository.findOne({
      where: { id: params.projectId },
      select: ['id', 'creatorId', 'isBanned'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.isBanned) {
      throw new ConflictException('Cannot add members to a banned project');
    }

    // Only project creator or admin can assign members
    if (
      params.currentUserRole !== UserRole.Admin &&
      project.creatorId !== params.currentUserId
    ) {
      throw new ForbiddenException(
        'Only the project owner or admin can assign members',
      );
    }

    // Verify the user has voted for the project
    const vote = await this.voteRepository.findOne({
      where: { userId: params.userId, projectId: params.projectId },
      select: ['id'],
    });

    if (!vote) {
      throw new ConflictException(
        'Only users who have voted for this project can be added as members',
      );
    }

    try {
      const member = this.repository.create({
        userId: params.userId,
        projectId: params.projectId,
      });
      const saved = await this.repository.save(member);

      // Return with user relation for the frontend
      return this.repository.findOne({
        where: { id: saved.id },
        relations: { user: true },
        select: {
          id: true,
          userId: true,
          assignedAt: true,
          user: {
            id: true,
            fullName: true,
            imageUrl: true,
            gravatar: true,
          },
        },
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'User is already a member of this project',
        );
      }
      throw error;
    }
  }

  async getMembers(projectId: string): Promise<ProjectMember[]> {
    return this.repository.find({
      where: { projectId },
      relations: { user: true },
      select: {
        id: true,
        userId: true,
        assignedAt: true,
        user: {
          id: true,
          fullName: true,
          imageUrl: true,
          gravatar: true,
        },
      },
      order: { assignedAt: 'ASC' },
    });
  }

  async getVoters(params: {
    projectId: string;
    currentUserId: string;
    currentUserRole: UserRole;
  }): Promise<User[]> {
    const project = await this.projectRepository.findOne({
      where: { id: params.projectId },
      select: ['id', 'creatorId'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Only project creator or admin can see voters list
    if (
      params.currentUserRole !== UserRole.Admin &&
      project.creatorId !== params.currentUserId
    ) {
      throw new ForbiddenException(
        'Only the project owner or admin can view voters',
      );
    }

    // Get voters who are NOT already members
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .innerJoinAndSelect('vote.user', 'user')
      .leftJoin(
        'project_member',
        'pm',
        'pm."userId" = vote."userId" AND pm."projectId" = vote."projectId"',
      )
      .where('vote."projectId" = :projectId', {
        projectId: params.projectId,
      })
      .andWhere('pm.id IS NULL')
      .select([
        'vote.id',
        'user.id',
        'user.fullName',
        'user.imageUrl',
        'user.gravatar',
      ])
      .getMany();

    return votes.map((vote) => vote.user);
  }

  async removeMember(params: {
    projectId: string;
    userId: string;
    currentUserId: string;
    currentUserRole: UserRole;
  }): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: params.projectId },
      select: ['id', 'creatorId'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      params.currentUserRole !== UserRole.Admin &&
      project.creatorId !== params.currentUserId
    ) {
      throw new ForbiddenException(
        'Only the project owner or admin can remove members',
      );
    }

    const result = await this.repository.delete({
      projectId: params.projectId,
      userId: params.userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Member not found');
    }
  }
}
