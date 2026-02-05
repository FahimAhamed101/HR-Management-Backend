import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { validate } from '../middleware/validate';
import {
  attendanceCreateSchema,
  attendanceUpdateSchema,
} from '../validators/attendanceValidator';

const router = Router();
const controller = new AttendanceController();

/**
 * @openapi
 * /attendance:
 *   get:
 *     summary: List attendance records
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendance'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /attendance:
 *   post:
 *     summary: Create or upsert attendance record
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - date
 *               - check_in_time
 *             properties:
 *               employee_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               check_in_time:
 *                 type: string
 *                 example: "09:00"
 *     responses:
 *       201:
 *         description: Created or updated attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 */
router.post('/', validate(attendanceCreateSchema), controller.create);

/**
 * @openapi
 * /attendance/{id}:
 *   put:
 *     summary: Update attendance record
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               check_in_time:
 *                 type: string
 *                 example: "09:00"
 *     responses:
 *       200:
 *         description: Updated attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance record not found
 */
router.put('/:id', validate(attendanceUpdateSchema), controller.update);

/**
 * @openapi
 * /attendance/{id}:
 *   delete:
 *     summary: Delete attendance record
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Attendance record not found
 */
router.delete('/:id', controller.delete);

export default router;
