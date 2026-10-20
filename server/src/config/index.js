import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/saree_web',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'slsh-super-secret-jwt-key-2025',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'slsh-refresh-secret-2025',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  
  // Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'srilakshmistore@gmail.com',
  },
  
  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // File upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};

export const isProduction = config.nodeEnv === 'production';
export const isDevelopment = config.nodeEnv === 'development';
