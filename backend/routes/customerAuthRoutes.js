import express from 'express';
import { 
  registerWithEmail, 
  loginWithEmail, 
  googleLogin, 
  requestOTP, 
  verifyOTP 
} from '../controllers/customerAuthController.js';

const router = express.Router();

// مسیرهای احراز هویت عمومی (برای مشتریان سایت)
router.post('/register', registerWithEmail);
router.post('/login', loginWithEmail);
router.post('/google', googleLogin);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

export default router;