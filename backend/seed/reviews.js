import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Review from '../models/Review.js';

const sampleReviews = [
  {
    name: 'محمد الکعبی',
    text: 'بهترین کباب ایرانی که در دوحه چشیده‌ام. فضای گرم و صمیمی.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-15')
  },
  {
    name: 'فاطمه العلی',
    text: 'کیفیت غذا فوق‌العاده است، دقیقاً مثل آشپزی خانگی اصیل ایرانی.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-10')
  },
  {
    name: 'احمد راشد',
    text: 'سرویس سریع، طعم اصیل، قیمت مناسب. حتماً دوباره می‌آیم.',
    rating: 4,
    status: 'approved',
    verified: false,
    date: new Date('2024-01-05')
  },
  {
    name: 'سارا الحمادی',
    text: 'منوی عالی و متنوع. کباب برگ و جوجه زعفرانی فوق‌العاده بودن.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-02')
  },
  {
    name: 'علی السویدی',
    text: 'فضای رستوران بسیار زیبا و دلنشین است. غذاها با کیفیت بالا.',
    rating: 4,
    status: 'pending',
    verified: false,
    date: new Date('2024-01-01')
  },
  {
    name: 'نوره القحطانی',
    text: 'دسرهای عالی و خدمات بی‌نظیر. حتماً توصیه می‌کنم به دوستان.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2023-12-28')
  },
  {
    name: 'خالد المنصور',
    text: 'غذاهای اصیل با طعم عالی. فضای رستوران بسیار دلنشین است.',
    rating: 4,
    status: 'approved',
    verified: false,
    date: new Date('2023-12-20')
  }
];

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant');
    console.log('📦 Connected to MongoDB');
    
    await Review.deleteMany({});
    console.log('🗑️  All reviews removed');
    
    await Review.insertMany(sampleReviews);
    console.log(`✅ ${sampleReviews.length} reviews seeded successfully`);
    
    console.log('\n📊 Review Stats:');
    console.log(`  - Total: ${sampleReviews.length}`);
    console.log(`  - Approved: ${sampleReviews.filter(r => r.status === 'approved').length}`);
    console.log(`  - Pending: ${sampleReviews.filter(r => r.status === 'pending').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
