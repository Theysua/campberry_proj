import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
