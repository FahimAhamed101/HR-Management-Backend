import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/knex';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

interface HrUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existing = await db('hr_users').where({ email }).first();
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

    let id: number;
    if (env.DB_CLIENT === 'pg') {
      const [row] = await db('hr_users')
        .insert({ name, email, password_hash: passwordHash })
        .returning(['id']);
      id = typeof row === 'object' ? row.id : row;
    } else {
      const result = await db('hr_users').insert({ name, email, password_hash: passwordHash });
      id = Array.isArray(result) ? result[0] : (result as number);
    }

    const user = { id, name, email };
    const token = jwt.sign({ sub: id, email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return { token, user };
  }

  async login(email: string, password: string) {
    const user = (await db('hr_users').where({ email }).first()) as HrUser | undefined;

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
