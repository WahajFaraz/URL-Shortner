import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from '../config/constants.js';

export const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many failed attempts, please try again later',
  skipSuccessfulRequests: true,
});

export const shortenerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'You have reached the limit of short URLs for this hour',
  keyGenerator: (req) => req.user?.id || req.ip,
});
