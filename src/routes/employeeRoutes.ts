import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import {
  employeeCreateSchema,
  employeeUpdateSchema,
} from '../validators/employeeValidator';

const router = Router();
const controller = new EmployeeController();

/**
 * @openapi
 * /employees:
 *   get:
 *     summary: List employees
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Partial name search
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
 *         description: Employee list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
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
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags:
 *       - Employees
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
 *         description: Employee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /employees:
 *   post:
 *     summary: Create employee
 *     tags:
 *       - Employees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - designation
 *               - hiring_date
 *               - date_of_birth
 *               - salary
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               designation:
 *                 type: string
 *               hiring_date:
 *                 type: string
 *                 format: date
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               salary:
 *                 type: number
 *                 format: float
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created employee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */
router.post('/', upload.single('photo'), validate(employeeCreateSchema), controller.create);

/**
 * @openapi
 * /employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags:
 *       - Employees
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               designation:
 *                 type: string
 *               hiring_date:
 *                 type: string
 *                 format: date
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               salary:
 *                 type: number
 *                 format: float
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated employee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */
router.put('/:id', upload.single('photo'), validate(employeeUpdateSchema), controller.update);

/**
 * @openapi
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags:
 *       - Employees
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
 *         description: Employee not found
 */
router.delete('/:id', controller.delete);

export default router;
