import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { AuthController } from './auth.controller';
import { LinkedinAuthService } from './services/linkedin-auth.service';
import { AuthService } from './services/auth.service';

@Module({
  providers: [FirebaseAuthService, LinkedinAuthService, AuthService],
  exports: [FirebaseAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
