import express from 'express';
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} from '../controllers/dishController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDishes);
router.get('/:id', getDishById);
router.post('/', protect, createDish);
router.put('/:id', protect, updateDish);
router.delete('/:id', protect, deleteDish);

export default router;
