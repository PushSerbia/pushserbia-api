import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LinkedinUser } from '../models/linkedin-user';
import { LinkedinAccessTokenParams } from '../models/linkedin-access-token-params';
import { LinkedinAccessTokenResponse } from '../models/linkedin-access-token-response';
import { ConfigService } from '@nestjs/config';
import { LinkedinConfig } from '../../../core/config/linkedin.config';

@Injectable()
export class LinkedinAuthService {
  private config: LinkedinConfig;

  constructor(private configService: ConfigService) {}

  getConfig(): LinkedinConfig {
    if (this.config) {
      return this.config;
    }
    const config = this.configService.get<LinkedinConfig>('linkedin');
    if (!config) {
      throw new Error('Linkedin config not found');
    }
    this.config = config;
    return this.config;
  }

  getTokenParams(code: string): URLSearchParams {
    const params: LinkedinAccessTokenParams = {
      ...this.getConfig(),
      grant_type: 'authorization_code',
      code: code,
    };
    return new URLSearchParams(params);
  }

  async getToken(code: string): Promise<LinkedinAccessTokenResponse> {
    try {
      const params = this.getTokenParams(code).toString();
      const req = await fetch(
        `https://www.linkedin.com/oauth/v2/accessToken?${params}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (!req.ok) {
        throw new UnauthorizedException('Something went wrong');
      }

      return (await req.json()) as LinkedinAccessTokenResponse;
    } catch (error) {
      throw new UnauthorizedException('Something went wrong');
    }
  }

  async getUser(accessToken: string): Promise<LinkedinUser> {
    try {
      const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        return (await response.json()) as LinkedinUser;
      }

      throw new UnauthorizedException('Something went wrong');
    } catch {
      throw new UnauthorizedException('Something went wrong');
    }
  }
}
