import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Review from './models/Review.js';

const reviews = [
  // ===== ۲ نظر عربی =====
  {
    name: 'محمد الكعبي',
    text: 'أفضل كباب إيراني تذوقته في الدوحة. أجواء دافئة وترحيبية.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-15')
  },
  {
    name: 'نورة القحطاني',
    text: 'حلويات رائعة وخدمة ممتازة. أنصح بها بشدة للأصدقاء.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-02')
  },
  
  // ===== ۳ نظر انگلیسی =====
  {
    name: 'John Smith',
    text: 'The best Persian kebab I have ever tasted. The saffron chicken is amazing!',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-20')
  },
  {
    name: 'Sarah Johnson',
    text: 'Excellent food and service. The atmosphere is warm and welcoming. Highly recommended!',
    rating: 4,
    status: 'approved',
    verified: false,
    date: new Date('2024-01-18')
  },
  {
    name: 'Michael Brown',
    text: 'Authentic Persian cuisine with great flavors. The lamb chops were perfect.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-12')
  },
  
  // ===== ۱ نظر فارسی =====
  {
    name: 'احمد رضایی',
    text: 'کیفیت غذا فوق‌العاده بود، دقیقاً مثل آشپزی خانگی اصیل ایرانی. حتماً دوباره می‌آیم.',
    rating: 5,
    status: 'approved',
    verified: true,
    date: new Date('2024-01-08')
  }
];

async function updateReviews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iranian-restaurant');
    console.log('📦 Connected to MongoDB');
    
    await Review.deleteMany({});
    console.log('🗑️  All reviews removed');
    
    await Review.insertMany(reviews);
    console.log(`✅ ${reviews.length} reviews updated successfully`);
    
    // نمایش آمار
    console.log('\n📊 Review Stats:');
    console.log(`  - Total: ${reviews.length}`);
    console.log(`  - Arabic: ${reviews.filter(r => r.name.match(/^[\u0600-\u06FF]/)).length}`);
    console.log(`  - English: ${reviews.filter(r => r.name.match(/^[A-Za-z]/)).length}`);
    console.log(`  - Persian: ${reviews.filter(r => r.name === 'احمد رضایی').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating reviews:', error);
    process.exit(1);
  }
}

updateReviews();
