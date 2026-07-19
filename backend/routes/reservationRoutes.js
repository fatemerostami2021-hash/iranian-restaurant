import express from 'express';
import { getReservations, updateReservationStatus } from '../controllers/reservationController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// مسیرهای مدیریت رزروها (فقط برای ادمین)
router.get('/', verifyAdminToken, getReservations);
router.put('/:id', verifyAdminToken, updateReservationStatus);

export default router;
