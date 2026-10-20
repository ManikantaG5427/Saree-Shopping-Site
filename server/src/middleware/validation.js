import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: 'path' in err ? err.path : 'unknown',
      message: err.msg,
      value: 'value' in err ? err.value : undefined,
    }));

    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR', formattedErrors);
  };
};

export const sanitize = (req, res, next) => {
  const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    const sanitizedQuery = sanitizeObject(req.query);
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }
  next();
};
