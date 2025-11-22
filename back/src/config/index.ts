import type { CorsOptions } from 'cors';

import { env } from './env';

const isProduction = env.NODE_ENV === 'prod';
const isLocale = env.LOCALE === 'true';

export default {
  app: {
    name: env.APPNAME,
    isProduction,
    isLocale,
    port: env.PORT || 8080,
    productionUrl: env.PRODUCTION_URL || `localhost:${env.PORT}`
  },
  cors: {
    origin: [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      env.CLIENT_BASE_URL,
      env.PRODUCTION_URL || `localhost:${env.PORT}`
    ],
    credentials: true
  } as CorsOptions,
  database: {
    postgres: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      url: env.DATABASE_URL
    },
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD
    }
  },
  jwt: {
    access: {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
    },
    refresh: {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN
    }
  },
  yandexApi: {
    clientID: env.YANDEX_CLIENT_ID,
    clientSecret: env.YANDEX_CLIENT_SECRET,
    tokenUrl: env.YANDEX_BASE_URL,
    loginUrl: env.YANDEX_LOGIN_URL
  }
} as const;
