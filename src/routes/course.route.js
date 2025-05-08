import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard.js';
import { CourseGuard } from '../middlewares/author.guard.js';

const router = Router();
const controller = new CourseController();

router
  .post('/', JwtAuthGuard, CourseGuard, controller.createCourse)
  .get('/', controller.getAllCourses)
  .get('/:id', controller.getCourseById)
  .patch('/:id', JwtAuthGuard, CourseGuard, controller.updateCourseById)
  .delete('/:id', JwtAuthGuard, CourseGuard, controller.deleteCourseById);

export default router;
