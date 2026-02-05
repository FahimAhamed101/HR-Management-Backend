import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DB_CLIENT: Joi.string().valid('pg', 'mysql2').default('pg'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().required(),
  DB_POOL_MIN: Joi.number().integer().min(0).default(2),
  DB_POOL_MAX: Joi.number().integer().min(1).default(10),
  DB_POOL_IDLE_MS: Joi.number().integer().min(1000).default(10000),
  DB_POOL_ACQUIRE_MS: Joi.number().integer().min(1000).default(60000),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  UPLOAD_DIR: Joi.string().default('uploads'),
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(4).default(10),
  SEED_HR_EMAIL: Joi.string().email().optional(),
  SEED_HR_PASSWORD: Joi.string().min(6).optional(),
  SEED_HR_NAME: Joi.string().min(2).optional(),
}).unknown();

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const uploadDir = path.resolve(process.cwd(), value.UPLOAD_DIR as string);

export const env = {
  NODE_ENV: value.NODE_ENV as string,
  PORT: value.PORT as number,
  DB_CLIENT: value.DB_CLIENT as 'pg' | 'mysql2',
  DB_HOST: value.DB_HOST as string,
  DB_PORT: value.DB_PORT as number,
  DB_USER: value.DB_USER as string,
  DB_PASSWORD: value.DB_PASSWORD as string,
  DB_NAME: value.DB_NAME as string,
  DB_POOL_MIN: value.DB_POOL_MIN as number,
  DB_POOL_MAX: value.DB_POOL_MAX as number,
  DB_POOL_IDLE_MS: value.DB_POOL_IDLE_MS as number,
  DB_POOL_ACQUIRE_MS: value.DB_POOL_ACQUIRE_MS as number,
  JWT_SECRET: value.JWT_SECRET as string,
  JWT_EXPIRES_IN: value.JWT_EXPIRES_IN as string,
  UPLOAD_DIR: uploadDir,
  BCRYPT_SALT_ROUNDS: value.BCRYPT_SALT_ROUNDS as number,
  SEED_HR_EMAIL: value.SEED_HR_EMAIL as string | undefined,
  SEED_HR_PASSWORD: value.SEED_HR_PASSWORD as string | undefined,
  SEED_HR_NAME: value.SEED_HR_NAME as string | undefined,
};
