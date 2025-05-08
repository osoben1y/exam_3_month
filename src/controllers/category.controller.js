import Category from '../models/category.model.js';
import { catchError } from '../utils/error-response.js';
import { categoryValidator } from '../validations/category.validation.js';

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { error, value } = categoryValidator(req.body);
      if (error) return catchError(res, 400, error);

      const { title, description } = value;
      const existCategory = await Category.findOne({ title });
      if (existCategory) return catchError(res, 409, 'Category already exists');

      const category = await Category.create({ title, description });

      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: category,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCategories(_, res) {
    try {
      const categories = await Category.find();
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: categories,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await CategoryController.findById(res, req.params.id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: category,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateCategoryById(req, res) {
    try {
      const id = req.params.id;
      const category = await CategoryController.findById(res, id);

      if (req.body.title) {
        const existTitle = await Category.findOne({ title: req.body.title });
        if (existTitle && id != existTitle._id) {
          return catchError(res, 409, 'Category title already exists');
        }
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updatedCategory,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteCategoryById(req, res) {
    try {
      const id = req.params.id;
      await CategoryController.findById(res, id);
      await Category.findByIdAndDelete(id);

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
      const category = await Category.findById(id);
      if (!category)
        return catchError(res, 404, `Category not found by ID ${id}`);
      return category;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
