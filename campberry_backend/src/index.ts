import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import publicRoutes from './routes/publicRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', publicRoutes);
app.use('/api/v1/me', protectedRoutes);

app.get('/', (req, res) => {
  res.send('Campberry API is running');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
