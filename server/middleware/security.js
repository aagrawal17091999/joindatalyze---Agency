import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000'];

export const helmetMiddleware = helmet({
  contentSecurityPolicy: isProd,
  crossOriginEmbedderPolicy: isProd,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

export const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // same-origin or tools like Postman
    if (corsOrigins.includes('*') || corsOrigins.includes(origin)) return cb(null, true);
    cb(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX) || 100;

export const rateLimitGeneral = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

const strictMax = Number(process.env.RATE_LIMIT_STRICT_MAX) || 10;

export const rateLimitStrict = rateLimit({
  windowMs,
  max: strictMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});
