import Dish from '../models/Dish.js';
import Order from '../models/Order.js';

// ===== ترتیب دسته‌بندی‌ها برای نمایش =====
const categoryOrder = {
  'main': 0,
  'combo': 1,
  'breakfast': 2,
  'appetizer': 3,
  'drinks': 4,
};

export const getDishes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    
    // ===== دریافت غذاها =====
    const dishes = await Dish.find(filter);
    
    // ===== مرتب‌سازی بر اساس دسته‌بندی (در حالت "all") =====
    if (category === 'all' || !category) {
      dishes.sort((a, b) => {
        const orderA = categoryOrder[a.category] ?? 99;
        const orderB = categoryOrder[b.category] ?? 99;
        return orderA - orderB;
      });
    } else {
      // در حالت فیلتر شده، بر اساس createdAt مرتب کن
      dishes.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    res.status(200).json(dishes);
  } catch (error) {
    console.error('Error in getDishes:', error);
    res.status(500).json({ message: 'خطا در دریافت لیست غذاها', error: error.message });
  }
};

export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json(dish);
  } catch (error) {
    console.error('Error in getDishById:', error);
    res.status(500).json({ message: 'خطا در دریافت اطلاعات غذا', error: error.message });
  }
};

export const getCategoriesSummary = async (req, res) => {
  try {
    // ===== ترتیب دسته‌بندی‌ها برای نمایش =====
    const categories = ['main', 'combo', 'breakfast', 'appetizer', 'drinks'];

    const result = await Promise.all(
      categories.map(async (key) => {
        const count = await Dish.countDocuments({ category: key });
        const items = await Dish.find({ category: key })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('_id code name price images');
        return { key, count, items };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getCategoriesSummary:', error);
    res.status(500).json({ message: 'خطا در دریافت خلاصه دسته‌بندی‌ها', error: error.message });
  }
};

export const createDish = async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (error) {
    console.error('Error in createDish:', error);
    res.status(400).json({ message: 'خطا در ایجاد غذای جدید', error: error.message });
  }
};

export const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json(dish);
  } catch (error) {
    console.error('Error in updateDish:', error);
    res.status(400).json({ message: 'خطا در ویرایش غذا', error: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json({ message: 'Dish deleted' });
  } catch (error) {
    console.error('Error in deleteDish:', error);
    res.status(500).json({ message: 'خطا در حذف غذا', error: error.message });
  }
};

// دریافت پرفروش‌ترین غذاهای هفته
export const getBestOfWeek = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const best = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.dish',
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'dishes', localField: '_id', foreignField: '_id', as: 'dish' } },
      { $unwind: '$dish' },
      {
        $project: {
          _id: '$dish._id',
          name: '$dish.name',
          price: '$dish.price',
          images: '$dish.images',
          slug: '$dish.slug',
          totalQuantity: 1,
        },
      },
    ]);

    // اگر هفته گذشته سفارشی نبود، چند غذای دلخواه را نشان بده
    if (best.length === 0) {
      const fallback = await Dish.find({ inStock: true }).limit(3);
      return res.status(200).json({ dishes: fallback, isFallback: true });
    }

    res.status(200).json({ dishes: best, isFallback: false });
  } catch (error) {
    console.error('Error in getBestOfWeek:', error);
    res.status(500).json({ message: 'خطا در دریافت پیشنهادات هفته', error: error.message });
  }
};