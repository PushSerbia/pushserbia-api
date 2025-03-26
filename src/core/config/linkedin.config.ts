import { registerAs } from '@nestjs/config';

export interface LinkedinConfig {
  redirect_uri: string;
  client_id: string;
  client_secret: string;
}

export default registerAs<LinkedinConfig>('linkedin', () => ({
  redirect_uri: process.env.LINKEDIN_REDIRECT_URI || '',
  client_id: process.env.LINKEDIN_CLIENT_ID || '',
  client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
}));
