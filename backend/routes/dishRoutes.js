import express from 'express';
import {
  getDishes,
  getDishById,
  getCategoriesSummary,
  getBestOfWeek,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ===== روت‌های عمومی =====
// (ترتیب این موارد مهم است: روت‌های خاص باید قبل از :id باشند)
router.get('/best-of-week', getBestOfWeek); 
router.get('/categories', getCategoriesSummary);
router.get('/', getDishes);
router.get('/:id', getDishById);

// ===== روت‌های مدیریت (فقط ادمین) =====
router.post('/', protect, createDish);
router.put('/:id', protect, updateDish);
router.delete('/:id', protect, deleteDish);

export default router;