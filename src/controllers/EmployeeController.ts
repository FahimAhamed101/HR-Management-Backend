import type { Request, Response } from 'express';
import { EmployeeService, type EmployeePayload } from '../services/EmployeeService';
import { asyncHandler } from '../middleware/asyncHandler';

export class EmployeeController {
  private service = new EmployeeService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const pageRaw = req.query.page ? Number(req.query.page) : undefined;
    const limitRaw = req.query.limit ? Number(req.query.limit) : undefined;
    const page = Number.isFinite(pageRaw) ? pageRaw : undefined;
    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const employees = await this.service.getAll({ page, limit, search });
    res.json(employees);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const employee = await this.service.getById(id);
    res.json(employee);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const payload: EmployeePayload = {
      ...req.body,
      photo_path: req.file?.filename,
    };
    const created = await this.service.create(payload);
    res.status(201).json(created);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: EmployeePayload = { ...req.body };
    if (req.file) {
      payload.photo_path = req.file.filename;
    }
    const updated = await this.service.update(id, payload);
    res.json(updated);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this.service.delete(id);
    res.json(result);
  });
}
