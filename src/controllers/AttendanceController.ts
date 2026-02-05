import type { Request, Response } from 'express';
import { AttendanceService, type AttendancePayload } from '../services/AttendanceService';
import { asyncHandler } from '../middleware/asyncHandler';

export class AttendanceController {
  private service = new AttendanceService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const filters: { employee_id?: number; date?: string } = {};
    if (req.query.employee_id) {
      filters.employee_id = Number(req.query.employee_id);
    }
    if (req.query.date) {
      filters.date = String(req.query.date);
    }
    const records = await this.service.getAll(filters);
    res.json(records);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await this.service.getById(id);
    res.json(record);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as AttendancePayload;
    const created = await this.service.create(payload);
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload = req.body as AttendancePayload;
    const updated = await this.service.update(id, payload);
    res.json(updated);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.service.delete(id);
    res.json(result);
  });
}
