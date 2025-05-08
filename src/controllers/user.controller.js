import User from '../models/user.model.js';
import { catchError } from '../utils/error-response.js';
import { userValidator } from '../validations/user.validation.js';
import { encode, decode } from '../utils/bcrypt-encrypt.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generate-token.js';
import jwt from 'jsonwebtoken';
import { refTokenWriteCookie } from '../utils/write-cookie.js';

export class UserController {
  async registerUser(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) return catchError(res, 400, error);

      const { fullName, password, email } = value;
      const existUser = await User.findOne({ email });
      if (existUser) return catchError(res, 409, 'Username already exists');

      const hashedPassword = await encode(password, 7);
      const user = await User.create({
        fullName,
        hashedPassword,
        email,
        role: 'user',
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async registerAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) return catchError(res, 400, error);
      const { fullName, password, email } = value;
      const existUser = await User.findOne({ email });
      if (existUser) return catchError(res, 409, 'Admin already exists');
      const hashedPassword = await encode(password, 7);
      const user = await User.create({
        fullName,
        hashedPassword,
        email,
        role: 'admin',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message); // faqat shu qatorni o‘zgartirdik
    }
  }

  async registerSuperAdmin(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) return catchError(res, 400, error);

      const { fullName, password, email } = value;
      const existUser = await User.findOne({ email });
      if (existUser) return catchError(res, 409, 'Superadmin already exists');

      const hashedPassword = await encode(password, 7);
      const user = await User.create({
        fullName,
        hashedPassword,
        email,
        role: 'superadmin',
      });

      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async registerAuthor(req, res) {
    try {
      const { error, value } = userValidator(req.body);
      if (error) return catchError(res, 400, error);
      const { fullName, password, email, role } = value;
      const existUser = await User.findOne({ email });
      if (existUser) return catchError(res, 409, 'Author already exists');
      const hashedPassword = await encode(password, 7);
      const user = await User.create({
        fullName,
        hashedPassword,
        email,
        role: 'author',
      });
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signinUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return catchError(res, 404, 'User not found');

      const isMatchPassword = await decode(password, user.hashedPassword);
      if (!isMatchPassword) return catchError(res, 400, 'Invalid password');

      const payload = { id: user._id, role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      refTokenWriteCookie(res, 'refreshTokenUser', refreshToken);

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async accessToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenUser;
      if (!refreshToken) return catchError(res, 401, 'Refresh token not found');

      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) return catchError(res, 401, 'Refresh token expired');

      const payload = { id: decodedToken.id, role: decodedToken.role };
      const accessToken = generateAccessToken(payload);

      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: accessToken,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async signoutUser(req, res) {
    try {
      const refreshToken = req.cookies.refreshTokenUser;
      if (!refreshToken) return catchError(res, 401, 'Refresh token not found');
      const decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) return catchError(res, 401, 'Refresh token expired');
      res.clearCookie('refreshTokenUser');
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllUsers(_, res) {
    try {
      const users = await User.find();
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: users,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserController.findById(res, req.params.id);
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: user,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateUserById(req, res) {
    try {
      const id = req.params.id;
      const user = await UserController.findById(res, id);
      if (req.body.fullName) {
        const existFullName = await User.findOne({
          fullName: req.body.fullName,
        });
        if (existFullName && id != existFullName._id) {
          return catchError(res, 409, 'Username already exists');
        }
      }
      let hashedPassword = user.hashedPassword;
      if (req.body.password) {
        hashedPassword = await encode(req.body.password, 7);
        delete req.body.password;
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { ...req.body, hashedPassword },
        { new: true }
      );
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: updatedUser,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteUserById(req, res) {
    try {
      const id = req.params.id;
      const user = await UserController.findById(res, id);
      await User.findByIdAndDelete(id);
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
      const user = await User.findById(id);
      if (!user) return catchError(res, 404, `User not found by ID ${id}`);
      return user;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
