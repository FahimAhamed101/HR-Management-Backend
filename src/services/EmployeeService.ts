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
  private baseQuery() {
    return db('employees').whereNull('deleted_at');
  }

  async getAll(options?: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
    const offset = (page - 1) * limit;

    const query = this.baseQuery();

    if (options?.search) {
      const term = options.search.trim();
      if (term) {
        if (env.DB_CLIENT === 'pg') {
          query.where('name', 'ilike', `%${term}%`);
        } else {
          query.whereRaw('LOWER(name) LIKE ?', [`%${term.toLowerCase()}%`]);
        }
      }
    }

    const countResult = await query.clone().count<{ count: string }[]>('* as count');
    const total = Number(countResult[0]?.count ?? 0);
    const data = await query.clone().select('*').orderBy('id', 'desc').limit(limit).offset(offset);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    const employee = await this.baseQuery().where({ id }).first();
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
    const exists = await this.baseQuery().where({ id }).first();
    if (!exists) {
      throw new AppError('Employee not found', 404);
    }

    await db('employees').where({ id }).update({ ...payload, updated_at: db.fn.now() });
    return this.getById(id);
  }

  async delete(id: number) {
    const exists = await this.baseQuery().where({ id }).first();
    if (!exists) {
      throw new AppError('Employee not found', 404);
    }
    await db('employees').where({ id }).update({ deleted_at: db.fn.now(), updated_at: db.fn.now() });
    return { success: true };
  }
}
