import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { LinkedinAuthService } from './services/linkedin-auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../core/config/auth.config';

@Controller('auth')
export class AuthController {
  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private linkedinAuthService: LinkedinAuthService,
    private configService: ConfigService,
  ) {}

  @Get('redirect/linkedin')
  async linkedinRedirect(@Query('code') code: string, @Res() res: Response) {
    const authConfig = this.configService.get<AuthConfig>('auth')!;

    const token = await this.linkedinAuthService.getToken(code);
    if (!token) {
      return res.redirect(HttpStatus.FOUND, authConfig.loginPage);
    }

    const user = await this.linkedinAuthService.getUser(token.access_token);
    if (!user) {
      return res.redirect(HttpStatus.FOUND, authConfig.loginPage);
    }

    const firebaseToken =
      await this.firebaseAuthService.authenticateWithLinkedin(user);

    return res.redirect(
      HttpStatus.FOUND,
      `${authConfig.accountPage}?customToken=${firebaseToken}`,
    );
  }
}
