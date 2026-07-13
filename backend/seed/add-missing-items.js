import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// آیتم‌های缺失 (۲۴ عدد)
const missingItems = [
  // ===== غذای اصلی (Missing) =====
  {
    code: "0010",
    name: {
      en: "Mix Grill (1 Person, 4 skewers)",
      fa: "میکس گریل (۱ نفر، ۴ سیخ)",
      ar: "مشاوي مشكل (شخص واحد، ٤ سيخ)"
    },
    category: "main",
    price: 40,
    unit: "1 Person",
    weight: "1 Person",
    description: {
      en: "Mixed grill for 1 person with 4 skewers",
      fa: "میکس گریل برای ۱ نفر با ۴ سیخ",
      ar: "مشاوي مشكل لشخص واحد مع ٤ سيخ"
    },
    inStock: true
  },
  {
    code: "0010-2",
    name: {
      en: "Mix Grill (2 Persons, 8 skewers)",
      fa: "میکس گریل (۲ نفر، ۸ سیخ)",
      ar: "مشاوي مشكل (شخصين، ٨ سيخ)"
    },
    category: "main",
    price: 70,
    unit: "2 Persons",
    weight: "2 Persons",
    description: {
      en: "Mixed grill for 2 persons with 8 skewers",
      fa: "میکس گریل برای ۲ نفر با ۸ سیخ",
      ar: "مشاوي مشكل لشخصين مع ٨ سيخ"
    },
    inStock: true
  },

  // ===== غذاهای دیگر (Other Dishes) =====
  {
    code: "0022",
    name: {
      en: "Kofta Mutton Sandwich",
      fa: "ساندویچ کوفته گوشت",
      ar: "ساندوتش كفتة لحم الضأن"
    },
    category: "main",
    price: 15,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Mutton kofta sandwich",
      fa: "ساندویچ کوفته گوشت",
      ar: "ساندوتش كفتة لحم الضأن"
    },
    inStock: true
  },
  {
    code: "0023",
    name: {
      en: "Sandwich (Mutton/Chicken/Kofta)",
      fa: "ساندویچ (گوشت/مرغ/کوفته)",
      ar: "ساندوتش (لحم/دجاج/كفتة)"
    },
    category: "main",
    price: 45,
    unit: "3 Pieces",
    weight: "3 Pieces",
    description: {
      en: "3 sandwiches with choice of mutton, chicken or kofta",
      fa: "۳ ساندویچ با انتخاب گوشت، مرغ یا کوفته",
      ar: "٣ ساندوتش مع اختيار لحم أو دجاج أو كفتة"
    },
    inStock: true
  },
  {
    code: "0024",
    name: {
      en: "Irani Rice Plate",
      fa: "طبق برنج ایرانی",
      ar: "طبق أرز إيراني"
    },
    category: "main",
    price: 15,
    unit: "800g",
    weight: "800g",
    description: {
      en: "Persian style rice plate 800g",
      fa: "طبق برنج ایرانی ۸۰۰ گرم",
      ar: "طبق أرز إيراني ٨٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0025",
    name: {
      en: "Grilled Liver",
      fa: "جگر کبابی",
      ar: "كبدة مشوية"
    },
    category: "main",
    price: 30,
    unit: "350g",
    weight: "350g",
    description: {
      en: "Grilled liver with spices",
      fa: "جگر کبابی با ادویه",
      ar: "كبدة مشوية مع البهارات"
    },
    inStock: true
  },
  {
    code: "0026",
    name: {
      en: "Grilled Liver & Kidney",
      fa: "جگر و کلیه کبابی",
      ar: "كبدة و كلاوي مشوية"
    },
    category: "main",
    price: 35,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Grilled liver and kidney with spices",
      fa: "جگر و کلیه کبابی با ادویه",
      ar: "كبدة و كلاوي مشوية مع البهارات"
    },
    inStock: true
  },
  {
    code: "0027",
    name: {
      en: "Barg Kebab",
      fa: "کباب برگ",
      ar: "كباب برك"
    },
    category: "main",
    price: 65,
    unit: "One Set",
    weight: "One Set",
    description: {
      en: "Persian style barg kebab",
      fa: "کباب برگ ایرانی",
      ar: "كباب برك إيراني"
    },
    inStock: true
  },
  {
    code: "0028",
    name: {
      en: "Hummus (Large Plate)",
      fa: "حمص (طبق بزرگ)",
      ar: "حمص (طبق كبير)"
    },
    category: "main",
    price: 9,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Creamy hummus with olive oil",
      fa: "حمص با روغن زیتون",
      ar: "حمص مع زيت الزيتون"
    },
    inStock: true
  },
  {
    code: "0029",
    name: {
      en: "Mahyawa Bread (3 breads)",
      fa: "نان ماهیانه (۳ عدد)",
      ar: "خبز مهياوه (٣ أرغفة)"
    },
    category: "main",
    price: 15,
    unit: "3 Breads",
    weight: "3 Breads",
    description: {
      en: "Traditional Mahyawa bread 3 pieces",
      fa: "نان ماهیانه سنتی ۳ عدد",
      ar: "خبز مهياوه تقليدي ٣ أرغفة"
    },
    inStock: true
  },
  {
    code: "0030",
    name: {
      en: "Shirazi Salad",
      fa: "سالاد شیرازی",
      ar: "سلطة شيرازي"
    },
    category: "main",
    price: 8,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Traditional Shirazi salad with cucumber and tomato",
      fa: "سالاد شیرازی با خیار و گوجه",
      ar: "سلطة شيرازي مع خيار و طماطم"
    },
    inStock: true
  },
  {
    code: "0031",
    name: {
      en: "Halwa",
      fa: "حلوا",
      ar: "حلوة"
    },
    category: "main",
    price: 8,
    unit: "300g",
    weight: "300g",
    description: {
      en: "Traditional Persian halwa",
      fa: "حلوا سنتی ایرانی",
      ar: "حلوة فارسية تقليدية"
    },
    inStock: true
  },
  {
    code: "0032",
    name: {
      en: "Yogurt and Cucumber",
      fa: "ماست و خیار",
      ar: "روپ و خيار"
    },
    category: "main",
    price: 8,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Yogurt with cucumber and mint",
      fa: "ماست با خیار و نعناع",
      ar: "روپ مع خيار و نعناع"
    },
    inStock: true
  },
  {
    code: "0033",
    name: {
      en: "Garlic Yogurt",
      fa: "ماست سیر",
      ar: "روپ ثوم"
    },
    category: "main",
    price: 8,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Yogurt with garlic",
      fa: "ماست با سیر",
      ar: "روپ مع ثوم"
    },
    inStock: true
  },

  // ===== اقلام جانبی (Side Dishes) =====
  {
    code: "0044",
    name: {
      en: "Tandoor Bread Irani",
      fa: "نان تندوری ایرانی",
      ar: "خبز تندوري إيراني"
    },
    category: "main",
    price: 1,
    unit: "150g",
    weight: "150g",
    description: {
      en: "Traditional Iranian tandoor bread 150g",
      fa: "نان تندوری ایرانی ۱۵۰ گرم",
      ar: "خبز تندوري إيراني ١٥٠ غ"
    },
    inStock: true
  },
  {
    code: "0045",
    name: {
      en: "Cheese Bread",
      fa: "نان پنیری",
      ar: "خبز جبن"
    },
    category: "main",
    price: 5,
    unit: "-",
    weight: "-",
    description: {
      en: "Bread with cheese filling",
      fa: "نان با پنیر",
      ar: "خبز مع جبن"
    },
    inStock: true
  },
  {
    code: "0046",
    name: {
      en: "Mahyawa Bread",
      fa: "نان ماهیانه",
      ar: "خبز مهياوه"
    },
    category: "main",
    price: 3,
    unit: "-",
    weight: "-",
    description: {
      en: "Traditional Mahyawa bread",
      fa: "نان ماهیانه سنتی",
      ar: "خبز مهياوه تقليدي"
    },
    inStock: true
  },
  {
    code: "0047",
    name: {
      en: "Rocca Salad",
      fa: "سالاد روکا",
      ar: "سلطة جرجير"
    },
    category: "main",
    price: 5,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Fresh arugula salad",
      fa: "سالاد روکا تازه",
      ar: "سلطة جرجير طازجة"
    },
    inStock: true
  },
  {
    code: "0048",
    name: {
      en: "Yogurt",
      fa: "ماست",
      ar: "روپ"
    },
    category: "main",
    price: 5,
    unit: "500g",
    weight: "500g",
    description: {
      en: "Plain yogurt 500g",
      fa: "ماست ساده ۵۰۰ گرم",
      ar: "روب عادي ٥٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0049",
    name: {
      en: "Hummus",
      fa: "حمص",
      ar: "حمص"
    },
    category: "main",
    price: 8,
    unit: "-",
    weight: "-",
    description: {
      en: "Creamy hummus with olive oil",
      fa: "حمص با روغن زیتون",
      ar: "حمص مع زيت الزيتون"
    },
    inStock: true
  },
  {
    code: "0050",
    name: {
      en: "Shirazi Salad",
      fa: "سالاد شیرازی",
      ar: "سلطة شيرازي"
    },
    category: "main",
    price: 8,
    unit: "300g",
    weight: "300g",
    description: {
      en: "Traditional Shirazi salad 300g",
      fa: "سالاد شیرازی ۳۰۰ گرم",
      ar: "سلطة شيرازي ٣٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0051",
    name: {
      en: "Yogurt and Cucumber",
      fa: "ماست و خیار",
      ar: "روپ و خيار"
    },
    category: "main",
    price: 8,
    unit: "500g",
    weight: "500g",
    description: {
      en: "Yogurt with cucumber and mint 500g",
      fa: "ماست با خیار و نعناع ۵۰۰ گرم",
      ar: "روپ مع خيار و نعناع ٥٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0052",
    name: {
      en: "Garlic Yogurt",
      fa: "ماست سیر",
      ar: "روپ مع ثوم"
    },
    category: "main",
    price: 8,
    unit: "500g",
    weight: "500g",
    description: {
      en: "Yogurt with garlic 500g",
      fa: "ماست با سیر ۵۰۰ گرم",
      ar: "روپ مع ثوم ٥٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0059",
    name: {
      en: "Side Dish",
      fa: "طبق جانبی",
      ar: "طباق جانبية"
    },
    category: "main",
    price: 7,
    unit: "-",
    weight: "-",
    description: {
      en: "Assorted side dish",
      fa: "طبق جانبی متنوع",
      ar: "طباق جانبية متنوعة"
    },
    inStock: true
  },
  {
    code: "0060",
    name: {
      en: "Salad",
      fa: "سالاد",
      ar: "سلطة"
    },
    category: "main",
    price: 5,
    unit: "-",
    weight: "-",
    description: {
      en: "Fresh green salad",
      fa: "سالاد سبزیجات تازه",
      ar: "سلطة خضراء طازجة"
    },
    inStock: true
  },
  {
    code: "0061",
    name: {
      en: "Irani Bread (1pc)",
      fa: "نان ایرانی (۱ عدد)",
      ar: "خبز إيراني (١ قطعة)"
    },
    category: "main",
    price: 1,
    unit: "1pc",
    weight: "1pc",
    description: {
      en: "Traditional Iranian bread 1 piece",
      fa: "نان ایرانی ۱ عدد",
      ar: "خبز إيراني ١ قطعة"
    },
    inStock: true
  },
  {
    code: "0062",
    name: {
      en: "French Fries",
      fa: "سیب‌زمینی سرخ کرده",
      ar: "بطاطس مقلية"
    },
    category: "main",
    price: 10,
    unit: "-",
    weight: "-",
    description: {
      en: "Crispy french fries",
      fa: "سیب‌زمینی سرخ کرده ترد",
      ar: "بطاطس مقلية مقرمشة"
    },
    inStock: true
  }
];

async function addMissingItems() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant';
    await mongoose.connect(uri);
    console.log('✅ Connected to database');

    const dishSchema = new mongoose.Schema({
      code: String,
      name: {
        en: String,
        fa: String,
        ar: String
      },
      category: {
        type: String,
        enum: ['breakfast', 'main', 'combo', 'appetizer', 'drinks'],
        required: true
      },
      price: Number,
      unit: String,
      weight: String,
      description: {
        en: String,
        fa: String,
        ar: String
      },
      inStock: {
        type: Boolean,
        default: true
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });

    const Dish = mongoose.model('Dish', dishSchema);

    // بررسی تعداد قبل
    const beforeCount = await Dish.countDocuments();
    console.log(`📊 تعداد آیتم‌های قبل: ${beforeCount}`);

    // اضافه کردن آیتم‌های جدید (بدون حذف قبلی)
    const result = await Dish.insertMany(missingItems);
    console.log(`✅ ${result.length} آیتم جدید اضافه شد!`);

    // بررسی تعداد بعد
    const afterCount = await Dish.countDocuments();
    console.log(`📊 تعداد آیتم‌های بعد: ${afterCount}`);

    const stats = await Dish.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('\n📊 Menu Statistics:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} items`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addMissingItems();
