import { Router } from 'express';
import { healthCheck } from '../config/database.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const dbOk = await healthCheck();
    res.json({
      status: 'ok',
      database: dbOk ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'error',
      message: process.env.NODE_ENV === 'production' ? 'Service unavailable' : err.message,
    });
  }
});

export default router;
