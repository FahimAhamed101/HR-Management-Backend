import express from 'express';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(env.UPLOAD_DIR));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/employees', authenticate, employeeRoutes);
app.use('/attendance', authenticate, attendanceRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Not found: ${req.method} ${req.path}`, 404));
});

app.use(errorHandler);

export default app;
