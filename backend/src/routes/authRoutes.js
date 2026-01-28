import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { strictLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', strictLimiter, authController.register);
router.post('/login', strictLimiter, authController.login);
router.post('/google', strictLimiter, authController.googleAuth);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

export default router;
