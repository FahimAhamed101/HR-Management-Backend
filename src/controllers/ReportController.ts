import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../utils/AppError';
import { ReportService } from '../services/ReportService';

export class ReportController {
  private service = new ReportService();

  attendanceSummary = asyncHandler(async (req: Request, res: Response) => {
    const month = String(req.query.month ?? '').trim();
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new AppError('month query parameter is required in YYYY-MM format', 400);
    }

    const employeeId = req.query.employee_id ? Number(req.query.employee_id) : undefined;
    const data = await this.service.attendanceSummary(month, employeeId);
    res.json({ month, data });
  });
}
