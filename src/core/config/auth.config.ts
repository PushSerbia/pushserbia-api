import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  callbackUrls: string;
  productionLoginPage: string;
  loginPage: string;
  accountPage: string;
}

export default registerAs<AuthConfig>('auth', () => ({
  callbackUrls: process.env.AUTH_CALLBACK_URLS || '',
  productionLoginPage: process.env.AUTH_PRODUCTION_LOGIN_PAGE || '',
  loginPage: process.env.AUTH_LOGIN_PAGE_URL || '',
  accountPage: process.env.AUTH_ACCOUNT_PAGE_URL || '',
}));
