import 'dotenv/config';
import express from 'express';
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimitGeneral,
} from './middleware/security.js';
import healthRouter from './routes/health.js';
import contactsRouter from './routes/contacts.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';
const isProd = process.env.NODE_ENV === 'production';

// Security: order matters
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '100kb' }));
app.use(rateLimitGeneral);

// API routes
app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/contacts`, contactsRouter);
app.use(`${API_PREFIX}/users`, usersRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (no stack trace in production)
app.use((err, _req, res, _next) => {
  const status = err.statusCode || err.status || 500;
  const message = isProd ? 'Internal server error' : (err.message || 'Internal server error');
  if (!isProd && err.stack) {
    console.error(err.stack);
  }
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Datalyze API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(`Health: http://localhost:${PORT}${API_PREFIX}/health`);
});
