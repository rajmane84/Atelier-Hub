import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import { env } from './util/env';
import V1Router from './routes/v1/index';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import { rateLimiter, emailRateLimiter } from './util/rateLimiter';

const app = express();

app.set('trust proxy', false);

app.use(rateLimiter);

app.use(
  cors({
    origin(origin, callback) {
      // allow no-origin requests (curl, server-to-server, some mobile clients)
      if (!origin) return callback(null, true);

      if (env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.warn('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use('/api/auth/send-verification-email', emailRateLimiter);
app.use('/api/auth/forget-password', emailRateLimiter);
app.use('/api/auth/reset-password', emailRateLimiter);

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

// All v1 routes
app.use('/api/v1', V1Router);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

export default app;
export { app };
