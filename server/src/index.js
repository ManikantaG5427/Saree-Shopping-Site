import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';
import orderRoutes from './routes/order.js';
import cartRoutes from './routes/cart.js';
import reviewRoutes from './routes/review.js';
import bannerRoutes from './routes/banner.js';
import couponRoutes from './routes/coupon.js';
import settingRoutes from './routes/setting.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/user.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// MongoDB Database connection
const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/saree_db';
mongoose
  .connect(mongoUri)
  .then(() => console.log('[Sri Lakshmi Saree House] MongoDB Connected'))
  .catch((err) => {
    console.error('[Sri Lakshmi Saree House] Database connection error:', err.message);
  });

// Security & compression
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize inputs
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = value.trim();
      }
    }
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Sri Lakshmi Saree House',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Sri Lakshmi Saree House] Backend running on port ${PORT}`);
  console.log(`[Environment] ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Allowed Origin] ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

export default app;
