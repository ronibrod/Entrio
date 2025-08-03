import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import solutionsRoutes from './routes/solutions.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import searchRoutes from './routes/search.routes.js';

dotenv.config();

async function init() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/solutions', solutionsRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/search', searchRoutes);

  await connectToMongoDB(app);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
