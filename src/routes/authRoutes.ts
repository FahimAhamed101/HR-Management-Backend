import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/authValidator';

const router = Router();
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: HR login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);

export default router;
