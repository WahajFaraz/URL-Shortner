import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

export const securityMiddleware = [
  helmet(),
  mongoSanitize(),
];

export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
