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
