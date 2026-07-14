import express from 'express';
import Dish from '../models/Dish.js';

const router = express.Router();

// دریافت همه غذاها
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت دسته‌بندی‌ها با آیتم‌ها (برای مگامنو)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Dish.aggregate([
      {
        $group: {
          _id: '$category',
          items: {
            $push: {
              name: {
                en: '$name.en',
                fa: '$name.fa',
                ar: '$name.ar'
              },
              slug: '$slug'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          key: '$_id',
          items: 1,
          count: 1,
          _id: 0
        }
      }
    ]);
    res.json(categories);
  } catch (error) {
    console.error('Error in /categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// دریافت غذاها بر اساس دسته‌بندی
router.get('/category/:category', async (req, res) => {
  try {
    const dishes = await Dish.find({ category: req.params.category });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
