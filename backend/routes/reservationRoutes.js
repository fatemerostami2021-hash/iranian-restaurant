import express from 'express';
import {
  getReservations,
  getReservationStats,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController.js';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyAdminToken);

router.get('/', getReservations);
router.get('/stats', getReservationStats);
router.patch('/:id/status', updateReservationStatus);
router.delete('/:id', deleteReservation);

export default router;