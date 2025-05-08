import Review from '../models/review.model.js';
import { catchError } from '../utils/error-response.js';
import { reviewValidator } from '../validations/review.validation.js';

export class ReviewController {
  async createReview(req, res) {
    try {
      const { error, value } = reviewValidator(req.body);
      if (error) return catchError(res, 400, error.message);

      const review = await Review.create(value);

      return res.status(201).json({
        statusCode: 201,
        message: 'Review created successfully',
        data: review,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllReviews(_, res) {
    try {
      const reviews = await Review.find()
        .populate('user', 'fullName email')
        .populate('course', 'title price');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: reviews,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findById(id)
        .populate('user', 'fullName email')
        .populate('course', 'title price');

      if (!review) return catchError(res, 404, `Review not found by ID ${id}`);

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: review,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateReviewById(req, res) {
    try {
      const { id } = req.params;

      const { error, value } = reviewValidator(req.body);
      if (error) return catchError(res, 400, error.message);

      const updated = await Review.findByIdAndUpdate(id, value, { new: true });

      if (!updated) return catchError(res, 404, `Review not found by ID ${id}`);

      return res.status(200).json({
        statusCode: 200,
        message: 'Review updated successfully',
        data: updated,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByIdAndDelete(id);

      if (!review) return catchError(res, 404, `Review not found by ID ${id}`);

      return res.status(200).json({
        statusCode: 200,
        message: 'Review deleted successfully',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
