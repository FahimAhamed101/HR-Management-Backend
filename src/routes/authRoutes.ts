import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/authValidator';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);

export default router;
