import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  loginPage: string;
  accountPage: string;
}

export default registerAs<AuthConfig>('auth', () => ({
  loginPage: process.env.AUTH_LOGIN_PAGE_URL || '',
  accountPage: process.env.AUTH_ACCOUNT_PAGE_URL || '',
}));
