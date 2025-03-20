import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { AuthController } from './auth.controller';
import { LinkedinAuthService } from './services/linkedin-auth.service';

@Module({
  providers: [FirebaseAuthService, LinkedinAuthService],
  exports: [FirebaseAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
