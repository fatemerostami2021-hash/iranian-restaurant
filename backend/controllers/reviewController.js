import Review from '../models/Review.js';

// ===== دریافت نظرات تایید شده =====
export const getReviews = async (req, res) => {
  try {
    const { limit = 6, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, totalReviews, ratingAgg] = await Promise.all([
      Review.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('name text rating verified date createdAt'),
      
      Review.countDocuments({ status: 'approved' }),
      
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ])
    ]);

    const satisfactionAgg = await Review.aggregate([
      { $match: { status: 'approved' } },
      { 
        $group: { 
          _id: null, 
          satisfied: { 
            $sum: { 
              $cond: [{ $gte: ['$rating', 4] }, 1, 0] 
            } 
          },
          total: { $sum: 1 }
        } 
      }
    ]);

    const satisfaction = satisfactionAgg[0] 
      ? Math.round((satisfactionAgg[0].satisfied / satisfactionAgg[0].total) * 100)
      : 98;

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating: ratingAgg[0]?.avg ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
      satisfaction,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error('Error in getReviews:', error);
    res.status(500).json({ 
      message: 'خطا در دریافت نظرات', 
      error: error.message 
    });
  }
};

// ===== ایجاد نظر جدید =====
export const createReview = async (req, res) => {
  try {
    const { name, text, rating, isAnonymous = false } = req.body;
    
    if (!name || !text || !rating) {
      return res.status(400).json({ 
        message: 'نام، متن و امتیاز الزامی هستند' 
      });
    }

    const review = new Review({
      name: isAnonymous ? 'ناشناس' : name,
      text,
      rating: Number(rating),
      status: 'pending',
      verified: false,
      userId: req.user?.id || null,
      isAnonymous
    });

    await review.save();

    res.status(201).json({
      message: 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود',
      review
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    res.status(400).json({ 
      message: 'خطا در ثبت نظر', 
      error: error.message 
    });
  }
};

// ===== دریافت آمار نظرات =====
export const getReviewsStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, avgRating] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'rejected' }),
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ])
    ]);

    res.status(200).json({
      total,
      pending,
      approved,
      rejected,
      averageRating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0
    });
  } catch (error) {
    console.error('Error in getReviewsStats:', error);
    res.status(500).json({ 
      message: 'خطا در دریافت آمار نظرات', 
      error: error.message 
    });
  }
};
