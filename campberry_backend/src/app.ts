import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import publicRoutes from './routes/publicRoutes';

const parseAllowedOrigins = () => {
  const rawOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ALLOWED_ORIGINS,
    'http://localhost:5173',
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(rawOrigins)];
};

export const createApp = () => {
  const app = express();
  const allowedOrigins = parseAllowedOrigins();

  app.set('trust proxy', 1);
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1', publicRoutes);
  app.use('/api/v1/me', protectedRoutes);

  app.get('/', (_req, res) => {
    res.send('Campberry API is running');
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
};

export const app = createApp();
