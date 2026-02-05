import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function seed(knex: Knex): Promise<void> {
  const email = process.env.SEED_HR_EMAIL;
  const password = process.env.SEED_HR_PASSWORD;
  const name = process.env.SEED_HR_NAME ?? 'HR Admin';

  if (!email || !password) {
    return;
  }

  const existing = await knex('hr_users').where({ email }).first();
  if (existing) {
    return;
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  const password_hash = await bcrypt.hash(password, saltRounds);

  await knex('hr_users').insert({ email, password_hash, name });
}
