import { db } from '../db/knex';
import { env } from '../config/env';

export class ReportService {
  async attendanceSummary(month: string, employeeId?: number) {
    const [yearStr, monthStr] = month.split('-');
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;

    const start = new Date(Date.UTC(year, monthIndex, 1));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));
    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    const lateCase =
      env.DB_CLIENT === 'pg'
        ? "CASE WHEN CAST(attendance.check_in_time AS time) > '09:45:00' THEN 1 ELSE 0 END"
        : "CASE WHEN TIME(attendance.check_in_time) > '09:45:00' THEN 1 ELSE 0 END";

    const query = db('attendance')
      .join('employees', 'attendance.employee_id', 'employees.id')
      .whereNull('employees.deleted_at')
      .whereBetween('attendance.date', [startDate, endDate])
      .groupBy('attendance.employee_id', 'employees.name')
      .select('attendance.employee_id as employee_id', 'employees.name')
      .count<{ days_present: string }[]>('* as days_present')
      .select(db.raw(`SUM(${lateCase}) as times_late`));

    if (employeeId) {
      query.where('attendance.employee_id', employeeId);
    }

    const rows = await query;

    return rows.map((row) => ({
      employee_id: Number(row.employee_id),
      name: row.name,
      days_present: Number(row.days_present ?? 0),
      times_late: Number((row as unknown as { times_late?: string }).times_late ?? 0),
    }));
  }
}
