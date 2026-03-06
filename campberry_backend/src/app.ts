import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import publicRoutes from './routes/publicRoutes';

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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
