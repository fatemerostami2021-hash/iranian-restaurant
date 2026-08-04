import express from 'express';
import { 
  getReviews,
  createReview,
  getReviewsStats
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getReviews);
router.get('/stats', getReviewsStats);
router.post('/', createReview);

export default router;
