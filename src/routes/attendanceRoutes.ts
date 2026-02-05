import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { validate } from '../middleware/validate';
import {
  attendanceCreateSchema,
  attendanceUpdateSchema,
} from '../validators/attendanceValidator';

const router = Router();
const controller = new AttendanceController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate(attendanceCreateSchema), controller.create);
router.put('/:id', validate(attendanceUpdateSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
