import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { asyncHandler } from '../middleware/asyncHandler';

export class AuthController {
  private service = new AuthService();

  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const result = await this.service.register(name, email, password);
    res.status(201).json(result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.service.login(email, password);
    res.json(result);
  });
}
