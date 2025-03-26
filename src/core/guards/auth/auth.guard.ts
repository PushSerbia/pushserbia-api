import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }
    
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    //zameniti sa proverom tokena
    if (token === 'test') {
      request.user = {
        id: 1,
        firebaseUid: 'testUid',
        email: 'test@example.com',
        fullName: 'Test User',
        level: 1,
        membershipStatus: 'free',
        isBlocked: false,
      };
      return true;
    }

    throw new UnauthorizedException('Invalid token');
  }
}