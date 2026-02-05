import { db } from '../db/knex';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface EmployeePayload {
  name?: string;
  age?: number;
  designation?: string;
  hiring_date?: string | Date;
  date_of_birth?: string | Date;
  salary?: number;
  photo_path?: string | null;
}

export class EmployeeService {
  async getAll() {
    return db('employees').select('*').orderBy('id', 'desc');
  }

  async getById(id: number) {
    const employee = await db('employees').where({ id }).first();
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }
    return employee;
  }

  async create(payload: EmployeePayload) {
    const data = {
      ...payload,
      photo_path: payload.photo_path ?? null,
    };

    let id: number;
    if (env.DB_CLIENT === 'pg') {
      const [row] = await db('employees').insert(data).returning(['id']);
      id = typeof row === 'object' ? row.id : row;
    } else {
      const result = await db('employees').insert(data);
      id = Array.isArray(result) ? result[0] : (result as number);
    }

    return this.getById(id);
  }

  async update(id: number, payload: EmployeePayload) {
    const exists = await db('employees').where({ id }).first();
    if (!exists) {
      throw new AppError('Employee not found', 404);
    }

    await db('employees').where({ id }).update({ ...payload, updated_at: db.fn.now() });
    return this.getById(id);
  }

  async delete(id: number) {
    const exists = await db('employees').where({ id }).first();
    if (!exists) {
      throw new AppError('Employee not found', 404);
    }
    await db('employees').where({ id }).del();
    return { success: true };
  }
}
