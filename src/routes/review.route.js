import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { AdminGuard } from '../middlewares/admin.guard.js';
import { SuperAdminGuard } from '../middlewares/superadmin.guard.js';

const router = Router();
const controller = new ReviewController();

router
  .post('/', JwtAuthGuard, controller.createReview)
  .get('/', JwtAuthGuard, controller.getAllReviews)
  .get('/:id', JwtAuthGuard, controller.getReviewById)
  .patch('/:id', JwtAuthGuard, AdminGuard, controller.updateReviewById)
  .delete('/:id', JwtAuthGuard, SuperAdminGuard, controller.deleteReviewById);

export default router;
