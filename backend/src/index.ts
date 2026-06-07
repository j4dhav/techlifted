import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './utils/logger';
import { applicationsRouter } from './routes/applications';
import { whatsappRouter } from './routes/whatsapp';
import { healthRouter } from './routes/health';
import { errorHandler, notFound } from './middleware/errorHandler';
import { uploadDir } from './middleware/upload';
import './db/database'; // initialize DB + schema on boot

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// CORS — allow only the configured frontend origin(s).
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / curl / server-to-server (no Origin header).
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS.`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Basic rate limiting to protect the public submission endpoint.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Serve uploaded files (admin reference). Files are non-guessable.
app.use('/uploads', express.static(uploadDir));

app.use('/api/health', healthRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/whatsapp', whatsappRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'EduBridge API', status: 'running' });
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  logger.info(`EduBridge API listening on http://localhost:${env.port}`);
  logger.info(`CORS origins: ${env.corsOrigins.join(', ') || '(none)'}`);
  logger.info(`Uploads dir: ${path.relative(process.cwd(), uploadDir)}`);
});

// Graceful shutdown + never crash on unhandled rejections.
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
});
function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
