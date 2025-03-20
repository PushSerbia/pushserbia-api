import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/enums/user-role';

export const Roles = Reflector.createDecorator<UserRole[]>();
