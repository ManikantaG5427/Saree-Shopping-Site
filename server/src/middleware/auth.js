import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('id email role');

    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('id email role');

    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };
      req.token = token;
    }

    next();
  } catch {
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    next();
  };
};

export const requireAdmin = authorize('ADMIN');
export const requireCustomer = authorize('CUSTOMER', 'ADMIN');
