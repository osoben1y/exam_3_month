import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';

const router = Router();
const controller = new EnrollmentController();

router
  .post('/', JwtAuthGuard, AdminGuard, controller.createEnrollment)
  .get('/:id', JwtAuthGuard, controller.getMyEnrollments)
  .get('/', JwtAuthGuard, AdminGuard, controller.getAllEnrollments)
  .get('/:id', JwtAuthGuard, controller.getEnrollmentById)
  .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteEnrollmentById)
  .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateEnrollmentById);

export default router;
