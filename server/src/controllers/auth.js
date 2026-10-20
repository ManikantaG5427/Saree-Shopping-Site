import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';
import { emailService } from '../services/email.js';

const SALT_ROUNDS = 12;

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'CUSTOMER',
    });

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.warn('Welcome email could not be sent:', e.message);
    }

    res.status(201).json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
          },
          accessToken: tokens.accessToken,
          tokens,
        },
        'Registration successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(
      successResponse(
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          accessToken: tokens.accessToken,
          tokens,
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    res.json(successResponse(null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      throw new AppError('Refresh token required', 401, 'REFRESH_TOKEN_REQUIRED');
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json(successResponse({ accessToken: tokens.accessToken, tokens }, 'Token refreshed'));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    res.json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      try {
        await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
      } catch (e) {
        console.warn('Password reset email failed:', e.message);
      }
    }

    res.json(successResponse(null, 'If an account exists, a reset link has been dispatched'));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      throw new AppError('Token and password are required', 400, 'INVALID_REQUEST');
    }
    res.json(successResponse(null, 'Password has been reset successfully'));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.json(successResponse(null, 'Password updated successfully'));
  } catch (error) {
    next(error);
  }
};
