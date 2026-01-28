import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { securityMiddleware, requestLogger, corsOptions } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import * as urlController from './controllers/urlController.js';

dotenv.config();

const app = express();

// Connect to database (safe for serverless: driver manages connections)
connectDB();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);
app.use(...securityMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/admin', adminRoutes);
app.use('/redirect', redirectRoutes);

// Handle short URL redirects directly
app.get('/:shortCode', asyncHandler(urlController.getShortUrl));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;


