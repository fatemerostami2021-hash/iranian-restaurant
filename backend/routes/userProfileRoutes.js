import express from 'express';
import { getProfile, addAddress, addCard, getMyOrders } from '../controllers/userProfileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// همه این مسیرها نیاز به لاگین دارند
router.get('/', protect, getProfile);
router.post('/addresses', protect, addAddress);
router.post('/cards', protect, addCard);
router.get('/orders', protect, getMyOrders); // ✅ اضافه شد

export default router;