import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const controller = new ReportController();

/**
 * @openapi
 * /reports/attendance:
 *   get:
 *     summary: Monthly attendance summary
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-08"
 *       - in: query
 *         name: employee_id
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Summary per employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       days_present:
 *                         type: integer
 *                       times_late:
 *                         type: integer
 */
router.get('/attendance', controller.attendanceSummary);

export default router;
