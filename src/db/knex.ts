import knex from 'knex';
import { env } from '../config/env';

export const db = knex({
  client: env.DB_CLIENT,
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_POOL_IDLE_MS,
    acquireTimeoutMillis: env.DB_POOL_ACQUIRE_MS,
  },
});
