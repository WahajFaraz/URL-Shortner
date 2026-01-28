import express from 'express';
import * as urlController from '../controllers/urlController.js';
import { protect } from '../middleware/auth.js';
import { shortenerLimiter, limiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', limiter, protect, shortenerLimiter, urlController.createShortUrl);
router.get('/analytics/dashboard', limiter, protect, urlController.getDashboardAnalytics);
router.get('/list', limiter, protect, urlController.getUserUrls);
router.get('/analytics/:id', limiter, protect, urlController.getUrlAnalytics);
router.get('/:id', limiter, protect, urlController.getUrlDetails);
router.put('/:id', limiter, protect, urlController.updateShortUrl);
router.delete('/:id', limiter, protect, urlController.deleteShortUrl);

export default router;
