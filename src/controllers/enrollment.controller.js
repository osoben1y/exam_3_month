import Enrollment from '../models/enrollment.model.js';
import { catchError } from '../utils/error-response.js';
import { enrollmentValidator } from '../validations/enrollment.validation.js';

export class EnrollmentController {
  async createEnrollment(req, res) {
    try {
      const { error, value } = enrollmentValidator(req.body);
      if (error) return catchError(res, 400, error);
      const { user, course } = value;
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
        .populate('user')
        .populate('course');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
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
      if (error) return catchError(res, 400, error);
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
        .populate('user')
        .populate('course');
      if (!enrollment)
        return catchError(res, 404, `Enrollment not found by ID ${id}`);
      return enrollment;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}

export default EnrollmentController;
