import { registerAs } from '@nestjs/config';
import { QueueOptions } from 'bullmq';

export default registerAs<QueueOptions>('redis', () => ({
  connection: {
    url: process.env.REDIS_URL,
  },
}));
