import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { OnModuleInit } from '@nestjs/common';

export class UsersGravatarBackfill implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ gravatar: () => 'md5(lower(btrim(email)))' })
      .where("(gravatar IS NULL OR gravatar = '')")
      .execute();
  }
}
