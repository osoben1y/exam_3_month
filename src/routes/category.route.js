import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';
import { SuperAdminGuard } from '../middlewares/superadmin.guard.js';

const router = Router();
const controller = new CategoryController();

router
  .post('/', JwtAuthGuard, AdminGuard, controller.createCategory)
  .get('/', controller.getAllCategories)
  .get('/:id', controller.getCategoryById)
  .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateCategoryById)
  .delete('/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteCategoryById);

export default router;
