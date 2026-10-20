export class AppError extends Error {
  constructor(message, statusCode, code, details) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new AppError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflict(message, details) {
    return new AppError(message, 409, 'CONFLICT', details);
  }

  static validation(message, details) {
    return new AppError(message, 422, 'VALIDATION_ERROR', details);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }

  static tooManyRequests(message = 'Too many requests') {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS');
  }

  static paymentRequired(message = 'Payment required') {
    return new AppError(message, 402, 'PAYMENT_REQUIRED');
  }
}

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message, details) {
    super(message, 409, 'CONFLICT', details);
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}
