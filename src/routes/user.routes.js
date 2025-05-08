import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { SuperAdminGuard } from '../middlewares/superadmin.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';

const router = Router();
const controller = new UserController();

router
  .post('/register', controller.registerUser)
  .post(
    '/registerAdmin',
    JwtAuthGuard,
    SuperAdminGuard,
    controller.registerAdmin
  )
  .post(
    '/registerSuperAdmin',
    JwtAuthGuard,
    SuperAdminGuard,
    controller.registerSuperAdmin
  )
  .post('/registerAuthor', JwtAuthGuard, AdminGuard, controller.registerAuthor)
  .post('/signin', controller.signinUser)
  .get('/', JwtAuthGuard, AdminGuard, controller.getAllUsers)
  .get('/:id', JwtAuthGuard, AdminGuard, controller.getUserById)
  .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateUserById)
  .delete('/:id', JwtAuthGuard, AdminGuard, controller.deleteUserById);

export default router;
