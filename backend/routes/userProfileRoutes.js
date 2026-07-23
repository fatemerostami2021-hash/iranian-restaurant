import express from 'express';
import { getProfile, addAddress, addCard } from '../controllers/userProfileController.js';
import { protect } from '../middleware/auth.js'; // میدلور بررسی توکن

const router = express.Router();

// همه این مسیرها نیاز به لاگین دارند
router.get('/', protect, getProfile);
router.post('/addresses', protect, addAddress);
router.post('/cards', protect, addCard);

export default router;