import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dentistRoutes from './routes/dentistRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

app.use(rateLimiter);

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
