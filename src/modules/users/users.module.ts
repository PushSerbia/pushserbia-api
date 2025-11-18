import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UserProposedProjectProcessor } from './processors/user-proposed-project.processor';
import { UserSupportedProjectProcessor } from './processors/user-supported-project.processor';
import { UsersGravatarBackfill } from './hooks/user-gravatar-backfill';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [
    UsersService,
    UserProposedProjectProcessor,
    UserSupportedProjectProcessor,
    UsersGravatarBackfill,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
