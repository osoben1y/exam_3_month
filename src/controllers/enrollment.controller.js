import Enrollment from '../models/enrollment.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import { catchError } from '../utils/error-response.js';
import { enrollmentValidator } from '../validations/enrollment.validation.js';
import mongoose from 'mongoose';

export class EnrollmentController {
  async createEnrollment(req, res) {
    try {
      const { error, value } = enrollmentValidator(req.body);
      if (error) return catchError(res, 400, error.message);

      const { user, course } = value;

      // User va Course mavjudligini tekshirish
      const userExists = await User.findById(user);
      if (!userExists)
        return catchError(res, 404, `User not found by ID ${user}`);

      const courseExists = await Course.findById(course);
      if (!courseExists)
        return catchError(res, 404, `Course not found by ID ${course}`);

      const existEnrollment = await Enrollment.findOne({ user, course });
      if (existEnrollment)
        return catchError(res, 409, 'Already enrolled to this course');

      const enrollment = await Enrollment.create({ user, course });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: enrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllEnrollments(_, res) {
    try {
      const enrollments = await Enrollment.find()
        .populate('user', 'firstName lastName email')
        .populate('course', 'title price description');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: enrollments,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getMyEnrollments(req, res) {
    try {
      const { userId } = req.params;

      const enrollments = await Enrollment.find({
        user: new mongoose.Types.ObjectId(userId),
      }).populate('course', 'title price description');

      return res.status(200).json({
        statusCode: 200,
        message: 'My enrollments list',
        data: enrollments,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getEnrollmentById(req, res) {
    try {
      const enrollment = await EnrollmentController.findById(
        res,
        req.params.id
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: enrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteEnrollmentById(req, res) {
    try {
      const id = req.params.id;
      const enrollment = await EnrollmentController.findById(res, id);
      await Enrollment.findByIdAndDelete(id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Enrollment successfully deleted',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateEnrollmentById(req, res) {
    try {
      const id = req.params.id;
      const { error, value } = enrollmentValidator(req.body);
      if (error) return catchError(res, 400, error.message);

      const enrollment = await EnrollmentController.findById(res, id);
      if (!enrollment)
        return catchError(res, 404, `Enrollment not found by ID ${id}`);

      const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, value, {
        new: true,
      });

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updatedEnrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const enrollment = await Enrollment.findById(id)
        .populate('user', 'firstName lastName email')
        .populate('course', 'title price description');

      if (!enrollment)
        return catchError(res, 404, `Enrollment not found by ID ${id}`);

      return enrollment;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}

export default EnrollmentController;
