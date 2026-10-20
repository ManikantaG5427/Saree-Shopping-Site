import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { errorResponse } from '../utils/response.js';

export const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: errorResponse('Too many requests, please try again later', 'TOO_MANY_REQUESTS'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
  handler: (req, res) => {
    res.status(429).json(errorResponse('Too many requests, please try again later', 'TOO_MANY_REQUESTS'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: errorResponse('Too many authentication attempts, please try again later', 'TOO_MANY_ATTEMPTS'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: errorResponse('Too many API requests, please try again later', 'TOO_MANY_REQUESTS'),
  standardHeaders: true,
  legacyHeaders: false,
});

export const orderRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: errorResponse('Too many orders placed, please try again later', 'TOO_MANY_ORDERS'),
  standardHeaders: true,
  legacyHeaders: false,
});
