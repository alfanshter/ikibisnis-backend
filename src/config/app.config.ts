import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000'
  ).split(','),
  throttleTtl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
}));
