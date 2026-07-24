import Dish from '../models/Dish.js';
import Order from '../models/Order.js';

export const getDishes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const dishes = await Dish.find(filter).sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لیست غذاها', error });
  }
};

export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات غذا', error });
  }
};

export const getCategoriesSummary = async (req, res) => {
  try {
    const categories = ['breakfast', 'main', 'combo', 'appetizer', 'drinks'];

    const result = await Promise.all(
      categories.map(async (key) => {
        const count = await Dish.countDocuments({ category: key });
        const items = await Dish.find({ category: key })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('_id code name price');
        return { key, count, items };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت خلاصه دسته‌بندی‌ها', error });
  }
};

export const createDish = async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ message: 'خطا در ایجاد غذای جدید', error });
  }
};

export const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json(dish);
  } catch (error) {
    res.status(400).json({ message: 'خطا در ویرایش غذا', error });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.status(200).json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف غذا', error });
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
    res.status(500).json({ message: 'خطا در دریافت پیشنهادات هفته' });
  }
};