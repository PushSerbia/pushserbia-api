import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepositoryService } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepositoryService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ firebaseUid: userData.firebaseUid });
    if (existingUser) {
      throw new ConflictException(`User with firebaseUid ${userData.firebaseUid} already exists`);
    }
    return this.userRepository.create(userData);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ firebaseUid });
    if (!user) {
      throw new NotFoundException(`User with firebaseUid ${firebaseUid} not found`);
    }
    return user;
  }

  async blockUser(userId: string | number): Promise<User> {
    // Find the user or throw if not found
    await this.userRepository.findOne(userId);

    return this.userRepository.update(userId, { isBlocked: true });
  }

  async updateUser(userId: string | number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(userId, updateUserDto);
  }

  async deleteUser(userId: string | number): Promise<void> {
    await this.userRepository.remove(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}