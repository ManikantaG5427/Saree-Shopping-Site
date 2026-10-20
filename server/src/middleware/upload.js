import multer from 'multer';
import { config } from '../config/index.js';
import { AppError } from '../utils/errors.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    cb(new AppError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed', 400, 'INVALID_FILE_TYPE'));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize,
    files: 10,
  },
});

export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadArray = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        next(new AppError('File too large. Maximum size is 5MB', 400, 'FILE_TOO_LARGE'));
        break;
      case 'LIMIT_FILE_COUNT':
        next(new AppError('Too many files. Maximum is 10 files', 400, 'TOO_MANY_FILES'));
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        next(new AppError('Unexpected file field', 400, 'UNEXPECTED_FILE'));
        break;
      default:
        next(new AppError(`Upload error: ${err.message}`, 400, 'UPLOAD_ERROR'));
    }
  } else {
    next(err);
  }
};
