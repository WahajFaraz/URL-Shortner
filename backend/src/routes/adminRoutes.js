import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.put('/users/:id/disable', protect, adminOnly, adminController.disableUser);
router.put('/users/:id/enable', protect, adminOnly, adminController.enableUser);
router.put('/links/:id/disable', protect, adminOnly, adminController.disableLink);
router.get('/stats', protect, adminOnly, adminController.getAdminStats);

export default router;
