import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './middlewares/logger.js';
import urlRoutes from './routes/UrlRoute.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger);

app.use('/', urlRoutes);
// MongoDB Connect + App Listen
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB connected');
  } catch (error) {
    console.log(' MongoDB connection failed:', error.message);
  }
};
start()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });