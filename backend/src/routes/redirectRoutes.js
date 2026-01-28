import express from 'express';
import * as urlController from '../controllers/urlController.js';
import { limiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:identifier', limiter, urlController.getShortUrl);

export default router;
