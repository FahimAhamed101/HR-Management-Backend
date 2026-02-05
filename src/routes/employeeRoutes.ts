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

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('photo'), validate(employeeCreateSchema), controller.create);
router.put('/:id', upload.single('photo'), validate(employeeUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
