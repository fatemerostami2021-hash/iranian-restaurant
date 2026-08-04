import express from 'express';
import { login, register, getMe, googleAuth } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);   // ← ورود با گوگل
router.get('/me', protect, getMe);

export default router;