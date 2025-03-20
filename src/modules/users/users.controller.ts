import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '../auth/entities/current.user.entity';
import { FirebaseAuthService } from '../auth/services/firebase-auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private firebaseAuthService: FirebaseAuthService,
  ) {}

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Post('account')
  async account(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: CurrentUser,
  ) {
    if (user.email && user.email !== createUserDto.email) {
      throw new HttpException('Email does not match', HttpStatus.CONFLICT);
    }

    const existingUser = await this.usersService.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      await this.firebaseAuthService.setCustomUserData(user.uid, {
        app_user_id: existingUser.id,
        app_user_role: existingUser.role,
        app_user_active: !existingUser.isBlocked,
      });
      return this.usersService.update(existingUser.id, {
        ...existingUser,
        ...createUserDto,
        firebaseUid: user.uid,
      });
    }

    const account = await this.usersService.create({
      ...createUserDto,
      firebaseUid: user.uid,
      fullName: createUserDto.fullName,
    });

    await this.firebaseAuthService.setCustomUserData(user.uid, {
      app_user_id: account.id,
      app_user_role: account.role,
      app_user_active: !account.isBlocked,
    });

    return account;
  }

  @Get('me')
  async me(@GetUser() user: any) {
    if (!user?.id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const me = await this.usersService.findOneBy({ id: user.id });
    if (!me) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!me.firebaseUid) {
      throw new HttpException('User not linked', HttpStatus.NOT_FOUND);
    }
    return me;
  }

  @Get(':firebaseUid')
  async findByFirebaseUid(
    @Param('firebaseUid') firebaseUid: string,
  ): Promise<User> {
    return this.usersService.findByFirebaseUid(firebaseUid);
  }

  @Post(':id/block')
  async blockUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.blockUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
