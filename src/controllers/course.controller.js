import { Course } from '../models/course.model.js';
import { catchError } from '../utils/error-response.js';
import { courseValidator } from '../validations/course.validation.js';

export class CourseController {
  async createCourse(req, res) {
    try {
      const { error, value } = courseValidator(req.body);
      if (error) return catchError(res, 400, error);

      const { title, description, duration, price, author, category } = value;
      const course = await Course.create({
        title,
        description,
        duration,
        price,
        author,
        category,
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: course,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCourses(_, res) {
    try {
      const courses = await Course.find().populate('author category');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: courses,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await CourseController.findById(res, req.params.id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: course,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateCourseById(req, res) {
    try {
      const id = req.params.id;
      const course = await CourseController.findById(res, id);

      const { error, value } = courseValidator(req.body);
      if (error) return catchError(res, 400, error);

      const updatedCourse = await Course.findByIdAndUpdate(id, value, {
        new: true,
      });
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updatedCourse,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteCourseById(req, res) {
    try {
      const id = req.params.id;
      const course = await CourseController.findById(res, id);
      await Course.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const course = await Course.findById(id).populate('author category');
      if (!course) return catchError(res, 404, `Course not found by ID ${id}`);
      return course;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
