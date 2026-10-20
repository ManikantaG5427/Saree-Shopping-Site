import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from './errors.js';

export function generateAccessToken(payload) {
  return jwt.sign(
    { ...payload, type: 'access' },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiry }
  );
}

export function generateRefreshToken(payload) {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
}

export function generateTokens(payload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Access token expired', 401, 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid access token', 401, 'INVALID_TOKEN');
    }
    throw new AppError('Token verification failed', 401, 'TOKEN_VERIFICATION_FAILED');
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
    throw new AppError('Refresh token verification failed', 401, 'TOKEN_VERIFICATION_FAILED');
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
