import { AppError, isAppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';
import { isProduction, isDevelopment } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (isAppError(err)) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.code, err.details));
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json(errorResponse(`${field} already exists`, 'DUPLICATE_ENTRY', { field }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json(errorResponse(`Invalid ID format for ${err.path}`, 'INVALID_ID'));
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map(e => ({ field: e.path, message: e.message }));
    return res.status(422).json(errorResponse('Validation failed', 'VALIDATION_ERROR', details));
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    return res.status(400).json(errorResponse('Invalid JSON payload', 'INVALID_JSON'));
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json(errorResponse('Invalid token', 'INVALID_TOKEN'));
  }

  if (isProduction) {
    return res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  } else {
    return res.status(500).json(errorResponse(err.message, 'INTERNAL_ERROR', err.stack));
  }
};

export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse(`Route ${req.method} ${req.path} not found`, 'ROUTE_NOT_FOUND'));
};
