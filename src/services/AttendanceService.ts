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

  async getAll(filters?: { employee_id?: number; date?: string }) {
    const query = db('attendance').select('*').orderBy('id', 'desc');
    if (filters?.employee_id) {
      query.where({ employee_id: filters.employee_id });
    }
    if (filters?.date) {
      query.where({ date: filters.date });
    }
    return query;
  }

  async getById(id: number) {
    const record = await db('attendance').where({ id }).first();
    if (!record) {
      throw new AppError('Attendance record not found', 404);
    }
    return record;
  }

  async create(payload: AttendancePayload) {
    const employee = await db('employees').where({ id: payload.employee_id }).first();
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    const normalizedPayload = {
      ...payload,
      check_in_time: this.normalizeCheckInTime(payload.date as string | Date, payload.check_in_time),
    };

    let id: number;
    if (env.DB_CLIENT === 'pg') {
      const [row] = await db('attendance').insert(normalizedPayload).returning(['id']);
      id = typeof row === 'object' ? row.id : row;
    } else {
      const result = await db('attendance').insert(normalizedPayload);
      id = Array.isArray(result) ? result[0] : (result as number);
    }

    return this.getById(id);
  }

  async update(id: number, payload: AttendancePayload) {
    const exists = await db('attendance').where({ id }).first();
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
    const exists = await db('attendance').where({ id }).first();
    if (!exists) {
      throw new AppError('Attendance record not found', 404);
    }
    await db('attendance').where({ id }).del();
    return { success: true };
  }
}
