import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  APPNAME: z.string(),
  PORT: z.string(),
  NODE_ENV: z.string(),
  LOCALE: z.string(),
  PRODUCTION_URL: z.string(),
  CLIENT_BASE_URL: z.string().url(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_URL: z.string().startsWith('postgresql://')
});

export const env = envSchema.parse(process.env);
