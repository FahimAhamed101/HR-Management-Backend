import { db } from '../db/knex';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface AttendancePayload {
  employee_id?: number;
  date?: string | Date;
  check_in_time?: string | Date;
}

export class AttendanceService {
  private normalizeCheckInTime(
    dateValue: string | Date,
    checkInValue: string | Date | undefined,
  ) {
    if (!checkInValue) return undefined;
    if (checkInValue instanceof Date) return checkInValue;

    const timePattern = /^\d{2}:\d{2}(:\d{2})?$/;
    if (timePattern.test(checkInValue)) {
      const date = new Date(dateValue);
      const parts = checkInValue.split(':').map((value) => Number(value));
      const [hours, minutes, seconds] = [parts[0], parts[1], parts[2] ?? 0];
      date.setHours(hours, minutes, seconds, 0);
      return date;
    }

    return new Date(checkInValue);
  }

  async getAll(filters?: {
    employee_id?: number;
    date?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters?.limit ?? 10));
    const offset = (page - 1) * limit;

    const query = db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at');

    if (filters?.employee_id) {
      query.where('attendance.employee_id', filters.employee_id);
    }

    if (filters?.date) {
      query.where('attendance.date', filters.date);
    } else if (filters?.from && filters?.to) {
      query.whereBetween('attendance.date', [filters.from, filters.to]);
    } else if (filters?.from) {
      query.where('attendance.date', '>=', filters.from);
    } else if (filters?.to) {
      query.where('attendance.date', '<=', filters.to);
    }

    const countResult = await query.clone().count<{ count: string }[]>('* as count');
    const total = Number(countResult[0]?.count ?? 0);

    const data = await query
      .clone()
      .select('attendance.*')
      .orderBy('attendance.id', 'desc')
      .limit(limit)
      .offset(offset);

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
    const record = await db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .where('attendance.id', id)
      .select('attendance.*')
      .first();
    if (!record) {
      throw new AppError('Attendance record not found', 404);
    }
    return record;
  }

  async create(payload: AttendancePayload) {
    const employee = await db('employees')
      .where({ id: payload.employee_id })
      .whereNull('deleted_at')
      .first();
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    const normalizedPayload = {
      ...payload,
      check_in_time: this.normalizeCheckInTime(payload.date as string | Date, payload.check_in_time),
    };

    if (env.DB_CLIENT === 'pg') {
      const [row] = await db('attendance')
        .insert(normalizedPayload)
        .onConflict(['employee_id', 'date'])
        .merge({ check_in_time: normalizedPayload.check_in_time })
        .returning(['id']);

      const id = typeof row === 'object' ? row.id : row;
      return this.getById(id);
    }

    const existing = await db('attendance')
      .where({
        employee_id: normalizedPayload.employee_id,
        date: normalizedPayload.date,
      })
      .first();

    if (existing) {
      await db('attendance')
        .where({ id: existing.id })
        .update({ check_in_time: normalizedPayload.check_in_time });
      return this.getById(existing.id);
    }

    const result = await db('attendance').insert(normalizedPayload);
    const id = Array.isArray(result) ? result[0] : (result as number);
    return this.getById(id);
  }

  async update(id: number, payload: AttendancePayload) {
    const exists = await db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .where('attendance.id', id)
      .select('attendance.*')
      .first();
    if (!exists) {
      throw new AppError('Attendance record not found', 404);
    }

    const normalizedPayload = {
      ...payload,
      check_in_time: this.normalizeCheckInTime(
        (payload.date as string | Date) ?? exists.date,
        payload.check_in_time,
      ),
    };

    await db('attendance').where({ id }).update(normalizedPayload);
    return this.getById(id);
  }

  async delete(id: number) {
    const exists = await db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .where('attendance.id', id)
      .select('attendance.*')
      .first();
    if (!exists) {
      throw new AppError('Attendance record not found', 404);
    }
    await db('attendance').where({ id }).del();
    return { success: true };
  }
}
