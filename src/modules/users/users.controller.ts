import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get(':firebaseUid')
  async findByFirebaseUid(@Param('firebaseUid') firebaseUid: string): Promise<User> {
    return this.usersService.findByFirebaseUid(firebaseUid);
  }

  @Post(':id/block')
  async blockUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.blockUser(id);
  }
}
