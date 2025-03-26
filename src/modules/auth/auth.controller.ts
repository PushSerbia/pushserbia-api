import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('redirect/linkedin')
  async linkedinRedirect(
    @Query('code') code: string,
    @Query('callback') callback: string,
    @Res() res: Response,
  ) {
    const response = await this.authService.redirectionHandler(code, callback);

    return res.redirect(response.status, response.url);
  }
}
