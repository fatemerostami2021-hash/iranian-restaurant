import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// دیتای کامل منو با ترجمه‌های حرفه‌ای در سه زبان
const menuData = [
  // ===== صبحانه (Breakfast) =====
  {
    code: "0063",
    name: {
      en: "Hot Paya Stew with Bread & Salad",
      fa: "باجه داغ با سالاد و نان",
      ar: "باجة ساخنة مع السلطة والخبز"
    },
    category: "breakfast",
    price: 75,
    unit: "Full",
    weight: "Full",
    description: {
      en: "Traditional hot paya stew served with fresh bread and salad",
      fa: "باجه داغ سنتی همراه با نان و سالاد تازه",
      ar: "يخنة باجة ساخنة تقليدية تقدم مع خبز طازج وسلطة"
    },
    inStock: true
  },
  {
    code: "0064",
    name: {
      en: "Shirazi Herb Soup",
      fa: "آش سبزی شیرازی",
      ar: "آش سبزي شيرازي"
    },
    category: "breakfast",
    price: 18,
    unit: "500g",
    weight: "500g",
    description: {
      en: "Traditional Shirazi herb soup with bread",
      fa: "آش سبزی شیرازی سنتی با نان",
      ar: "حساء الأعشاب الشيرازي التقليدي مع الخبز"
    },
    inStock: true
  },
  {
    code: "0065",
    name: {
      en: "Cheese Bread",
      fa: "نان پنیری",
      ar: "خبز بالجبن"
    },
    category: "breakfast",
    price: 6,
    unit: "1pc",
    weight: "1pc",
    description: {
      en: "Freshly baked bread with cheese filling",
      fa: "نان تازه با پنیر آب شده",
      ar: "خبز طازج محشو بالجبن"
    },
    inStock: true
  },
  {
    code: "0066",
    name: {
      en: "Zaatar Bread",
      fa: "نان زعتر",
      ar: "خبز بالزعتر"
    },
    category: "breakfast",
    price: 6,
    unit: "1pc",
    weight: "1pc",
    description: {
      en: "Bread with zaatar spice mixture",
      fa: "نان با مخلوط ادویه زعتر",
      ar: "خبز مع خليط الزعتر"
    },
    inStock: true
  },
  {
    code: "0067",
    name: {
      en: "Traditional Foul",
      fa: "فول معمولی",
      ar: "فول عادي"
    },
    category: "breakfast",
    price: 18,
    unit: "400g",
    weight: "400g",
    description: {
      en: "Traditional fava beans with spices",
      fa: "باقالا سنتی با ادویه",
      ar: "فول تقليدي مع البهارات"
    },
    inStock: true
  },
  {
    code: "0068",
    name: {
      en: "Grilled Liver",
      fa: "جگر کبابی",
      ar: "كبدة مشوية"
    },
    category: "breakfast",
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
    code: "0069",
    name: {
      en: "Egg with Bread & Salad",
      fa: "تخم‌مرغ با نان و سالاد",
      ar: "بيض مع خبز وسلطة"
    },
    category: "breakfast",
    price: 15,
    unit: "-",
    weight: "-",
    description: {
      en: "Eggs served with bread and salad",
      fa: "تخم‌مرغ همراه با نان و سالاد",
      ar: "بيض يقدم مع خبز وسلطة"
    },
    inStock: true
  },
  {
    code: "0070",
    name: {
      en: "Tomato Paste Omelette",
      fa: "املت با رب گوجه",
      ar: "عجة بالبيض ومعجون الطماطم"
    },
    category: "breakfast",
    price: 18,
    unit: "-",
    weight: "-",
    description: {
      en: "Omelette with tomato paste",
      fa: "املت با رب گوجه فرنگی",
      ar: "عجة بالبيض مع معجون الطماطم"
    },
    inStock: true
  },
  {
    code: "0071",
    name: {
      en: "Fresh Tomato Omelette",
      fa: "املت با گوجه فرنگی",
      ar: "عجة بالطماطم الطازجة"
    },
    category: "breakfast",
    price: 20,
    unit: "-",
    weight: "-",
    description: {
      en: "Omelette with fresh tomatoes",
      fa: "املت با گوجه فرنگی تازه",
      ar: "عجة بالطماطم الطازجة"
    },
    inStock: true
  },
  {
    code: "0072",
    name: {
      en: "Egyptian Foul",
      fa: "فول مصری",
      ar: "فول مصري"
    },
    category: "breakfast",
    price: 20,
    unit: "-",
    weight: "-",
    description: {
      en: "Egyptian style fava beans",
      fa: "باقالا به سبک مصری",
      ar: "فول على الطريقة المصرية"
    },
    inStock: true
  },
  {
    code: "0073",
    name: {
      en: "Hummus (Large)",
      fa: "حمص بزرگ",
      ar: "حمص كبير"
    },
    category: "breakfast",
    price: 8,
    unit: "500g",
    weight: "500g",
    description: {
      en: "Creamy hummus with olive oil",
      fa: "حمص با روغن زیتون",
      ar: "حمص مع زيت الزيتون"
    },
    inStock: true
  },
  {
    code: "0074",
    name: {
      en: "Hummus (Small)",
      fa: "حمص کوچک",
      ar: "حمص صغير"
    },
    category: "breakfast",
    price: 8,
    unit: "200g",
    weight: "200g",
    description: {
      en: "Creamy hummus with olive oil",
      fa: "حمص با روغن زیتون",
      ar: "حمص مع زيت الزيتون"
    },
    inStock: true
  },
  {
    code: "0075",
    name: {
      en: "Mahyawa Bread",
      fa: "نان ماهیانه",
      ar: "خبز مهياوه"
    },
    category: "breakfast",
    price: 4,
    unit: "1pc",
    weight: "1pc",
    description: {
      en: "Traditional Mahyawa bread",
      fa: "نان ماهیانه سنتی",
      ar: "خبز مهياوه تقليدي"
    },
    inStock: true
  },
  // ===== غذای اصلی (Main Dishes) =====
  {
    code: "0001",
    name: {
      en: "Mixed Tikka (6 Skewers)",
      fa: "میکس تیکا (۶ سیخ)",
      ar: "مشاوي مشكلة (٦ سيخ)"
    },
    category: "main",
    price: 69,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Mixed tikka with 6 skewers (2 chicken, 2 mutton, 2 kofta)",
      fa: "میکس تیکا با ۶ سیخ (۲ جوجه، ۲ گوشت، ۲ کوفته)",
      ar: "مشاوي مشكلة مع ٦ سيخ (٢ دجاج، ٢ لحم، ٢ كفتة)"
    },
    inStock: true
  },
  {
    code: "0002",
    name: {
      en: "Mutton Kofta (4 Skewers)",
      fa: "کوفته گوشت (۴ سیخ)",
      ar: "كفتة لحم (٤ سيخ)"
    },
    category: "main",
    price: 45,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Minced mutton kofta with spices",
      fa: "کوفته گوشت چرخ کرده با ادویه",
      ar: "كفتة لحم مفروم مع البهارات"
    },
    inStock: true
  },
  {
    code: "0003",
    name: {
      en: "Saffron Chicken Kebab (4 Skewers)",
      fa: "جوجه زعفرانی (۴ سیخ)",
      ar: "دجاج بالزعفران (٤ سيخ)"
    },
    category: "main",
    price: 40,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Saffron marinated chicken kebab",
      fa: "جوجه کباب با زعفران",
      ar: "شيش دجاج متبل بالزعفران"
    },
    inStock: true
  },
  {
    code: "0004",
    name: {
      en: "Yogurt-Marinated Chicken (4 Skewers)",
      fa: "جوجه ماستی (۴ سیخ)",
      ar: "دجاج متبل باللبن (٤ سيخ)"
    },
    category: "main",
    price: 40,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Yogurt marinated chicken kebab",
      fa: "جوجه کباب با ماست",
      ar: "شيش دجاج متبل باللبن"
    },
    inStock: true
  },
  {
    code: "0005",
    name: {
      en: "Grilled Lamb Chops (4 Pieces)",
      fa: "ریش گوسفندی کبابی (۴ عدد)",
      ar: "ريش غنم مشوي (٤ قطع)"
    },
    category: "main",
    price: 69,
    unit: "4 Pieces",
    weight: "4 Pieces",
    description: {
      en: "Grilled lamb chops with spices",
      fa: "ریش گوسفندی کبابی با ادویه",
      ar: "ريش غنم مشوي مع البهارات"
    },
    inStock: true
  },
  {
    code: "0006",
    name: {
      en: "Chicken Kofta (4 Skewers)",
      fa: "کوفته مرغ (۴ سیخ)",
      ar: "كفتة دجاج (٤ سيخ)"
    },
    category: "main",
    price: 40,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Minced chicken kofta with spices",
      fa: "کوفته مرغ چرخ کرده با ادویه",
      ar: "كفتة دجاج مفروم مع البهارات"
    },
    inStock: true
  },
  {
    code: "0007",
    name: {
      en: "Grilled Chicken Wings (4 Skewers)",
      fa: "بال مرغ کبابی (۴ سیخ)",
      ar: "أجنحة دجاج مشوية (٤ سيخ)"
    },
    category: "main",
    price: 35,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Grilled chicken wings with spices",
      fa: "بال مرغ کبابی با ادویه",
      ar: "أجنحة دجاج مشوية مع البهارات"
    },
    inStock: true
  },
  {
    code: "0008",
    name: {
      en: "Traditional Kebab (4 Skewers)",
      fa: "کباب سنتی (۴ سیخ)",
      ar: "كباب تقليدي (٤ سيخ)"
    },
    category: "main",
    price: 45,
    unit: "4 Skewer",
    weight: "4 Skewer",
    description: {
      en: "Traditional kebab with spices",
      fa: "کباب سنتی با ادویه",
      ar: "كباب تقليدي مع البهارات"
    },
    inStock: true
  },
  {
    code: "0009",
    name: {
      en: "Saffron Chicken Kebab with Rice",
      fa: "جوجه زعفرانی با برنج",
      ar: "شيش دجاج بالزعفران مع الأرز"
    },
    category: "main",
    price: 35,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Saffron chicken kebab served with rice",
      fa: "جوجه زعفرانی کباب با برنج",
      ar: "شيش دجاج بالزعفران يقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0011",
    name: {
      en: "Mutton Kofta with Rice",
      fa: "کوفته گوشت با برنج",
      ar: "كفتة لحم مع الأرز"
    },
    category: "main",
    price: 40,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Mutton kofta served with rice",
      fa: "کوفته گوشت با برنج",
      ar: "كفتة لحم تقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0012",
    name: {
      en: "Chicken Kofta with Rice",
      fa: "کوفته مرغ با برنج",
      ar: "كفتة دجاج مع الأرز"
    },
    category: "main",
    price: 35,
    unit: "One Plate",
    weight: "One Plate",
    description: {
      en: "Chicken kofta served with rice",
      fa: "کوفته مرغ با برنج",
      ar: "كفتة دجاج تقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0013",
    name: {
      en: "Barg Kebab with Rice",
      fa: "کباب برگ با برنج",
      ar: "كباب برك مع الأرز"
    },
    category: "main",
    price: 75,
    unit: "-",
    weight: "-",
    description: {
      en: "Persian style barg kebab served with rice",
      fa: "کباب برگ ایرانی با برنج",
      ar: "كباب برك إيراني يقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0014",
    name: {
      en: "BBQ Chicken with Rice",
      fa: "جوجه کباب با برنج",
      ar: "دجاج مشوي مع الأرز"
    },
    category: "main",
    price: 35,
    unit: "-",
    weight: "-",
    description: {
      en: "BBQ chicken served with rice",
      fa: "جوجه کباب با برنج",
      ar: "دجاج مشوي يقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0015",
    name: {
      en: "BBQ Chicken with Bread",
      fa: "جوجه کباب با نان",
      ar: "دجاج مشوي مع الخبز"
    },
    category: "main",
    price: 30,
    unit: "-",
    weight: "-",
    description: {
      en: "BBQ chicken served with bread",
      fa: "جوجه کباب با نان",
      ar: "دجاج مشوي يقدم مع الخبز"
    },
    inStock: true
  },
  {
    code: "0018",
    name: {
      en: "Hot Paya Stew with Bread & Salad",
      fa: "باجه داغ با سالاد و نان",
      ar: "باجة ساخنة مع السلطة والخبز"
    },
    category: "main",
    price: 75,
    unit: "Full",
    weight: "Full",
    description: {
      en: "Traditional hot paya stew with bread and salad",
      fa: "باجه داغ سنتی با سالاد و نان",
      ar: "يخنة باجة ساخنة تقليدية مع الخبز والسلطة"
    },
    inStock: true
  },
  {
    code: "0019",
    name: {
      en: "Barberry Rice",
      fa: "زرشک پلو",
      ar: "أرز بالزرشك"
    },
    category: "main",
    price: 35,
    unit: "-",
    weight: "-",
    description: {
      en: "Persian barberry rice",
      fa: "زرشک پلو ایرانی",
      ar: "أرز بالزرشك على الطريقة الإيرانية"
    },
    inStock: true
  },
  {
    code: "0020",
    name: {
      en: "Okra Stew with Mutton",
      fa: "خورش بامیه با گوشت",
      ar: "يخنة بامية باللحم"
    },
    category: "main",
    price: 30,
    unit: "-",
    weight: "-",
    description: {
      en: "Okra stew with mutton served with rice",
      fa: "خورش بامیه با گوشت و برنج",
      ar: "يخنة بامية باللحم تقدم مع الأرز"
    },
    inStock: true
  },
  {
    code: "0021",
    name: {
      en: "Lentil Stew with Meat",
      fa: "خورش عدس با گوشت",
      ar: "يخنة عدس باللحم"
    },
    category: "main",
    price: 30,
    unit: "-",
    weight: "-",
    description: {
      en: "Lentil stew with meat served with rice",
      fa: "خورش عدس با گوشت و برنج",
      ar: "يخنة عدس باللحم تقدم مع الأرز"
    },
    inStock: true
  },
  // ===== سینی‌های گروهی (Combo Trays) =====
  {
    code: "0016",
    name: {
      en: "Mixed Grill Oval Tray (10 Persons)",
      fa: "سینی بیضی مخلوط (۱۰ نفر)",
      ar: "صينية مشاوي بيضاوية (۱۰ أشخاص)"
    },
    category: "combo",
    price: 500,
    unit: "10 Persons",
    weight: "10 Persons",
    description: {
      en: "Mixed grill oval tray for 10 persons with rice",
      fa: "سینی بیضی مخلوط برای ۱۰ نفر با برنج",
      ar: "صينية مشاوي بيضاوية لـ ۱۰ أشخاص مع الأرز"
    },
    inStock: true
  },
  {
    code: "0016-2",
    name: {
      en: "Mixed Grill Oval Tray (15 Persons)",
      fa: "سینی بیضی مخلوط (۱۵ نفر)",
      ar: "صينية مشاوي بيضاوية (۱۵ أشخاص)"
    },
    category: "combo",
    price: 750,
    unit: "15 Persons",
    weight: "15 Persons",
    description: {
      en: "Mixed grill oval tray for 15 persons with rice",
      fa: "سینی بیضی مخلوط برای ۱۵ نفر با برنج",
      ar: "صينية مشاوي بيضاوية لـ ۱۵ أشخاص مع الأرز"
    },
    inStock: true
  },
  {
    code: "0016-3",
    name: {
      en: "Mixed Grill Oval Tray (20 Persons)",
      fa: "سینی بیضی مخلوط (۲۰ نفر)",
      ar: "صينية مشاوي بيضاوية (۲۰ أشخاص)"
    },
    category: "combo",
    price: 1000,
    unit: "20 Persons",
    weight: "20 Persons",
    description: {
      en: "Mixed grill oval tray for 20 persons with rice",
      fa: "سینی بیضی مخلوط برای ۲۰ نفر با برنج",
      ar: "صينية مشاوي بيضاوية لـ ۲۰ أشخاص مع الأرز"
    },
    inStock: true
  },
  {
    code: "0017",
    name: {
      en: "Mixed Grill Round Tray (5 Persons)",
      fa: "سینی گرد مخلوط (۵ نفر)",
      ar: "صينية مشاوي مدورة (۵ أشخاص)"
    },
    category: "combo",
    price: 260,
    unit: "5 Persons",
    weight: "5 Persons",
    description: {
      en: "Mixed grill round tray for 5 persons with rice",
      fa: "سینی گرد مخلوط برای ۵ نفر با برنج",
      ar: "صينية مشاوي مدورة لـ ۵ أشخاص مع الأرز"
    },
    inStock: true
  },
  // ===== نوشیدنی‌ها (Drinks) =====
  {
    code: "0053",
    name: {
      en: "Hot Tea",
      fa: "چای داغ",
      ar: "شاي ساخن"
    },
    category: "drinks",
    price: 3,
    unit: "-",
    weight: "-",
    description: {
      en: "Traditional hot tea",
      fa: "چای داغ سنتی",
      ar: "شاي ساخن تقليدي"
    },
    inStock: true
  },
  {
    code: "0054",
    name: {
      en: "Pepsi (330ml)",
      fa: "پپسی (۳۳۰ میلی‌لیتر)",
      ar: "بيبسي (٣٣٠ مل)"
    },
    category: "drinks",
    price: 3,
    unit: "330ml",
    weight: "330ml",
    description: {
      en: "Pepsi 330ml can",
      fa: "پپسی ۳۳۰ میلی‌لیتر قوطی",
      ar: "علبة بيبسي ٣٣٠ مل"
    },
    inStock: true
  },
  {
    code: "0055",
    name: {
      en: "7up (330ml)",
      fa: "سون آپ (۳۳۰ میلی‌لیتر)",
      ar: "سفن أب (٣٣٠ مل)"
    },
    category: "drinks",
    price: 3,
    unit: "330ml",
    weight: "330ml",
    description: {
      en: "7up 330ml can",
      fa: "سون آپ ۳۳۰ میلی‌لیتر قوطی",
      ar: "علبة سفن أب ٣٣٠ مل"
    },
    inStock: true
  },
  {
    code: "0056",
    name: {
      en: "Mountain Dew (330ml)",
      fa: "ماونتین دو (۳۳۰ میلی‌لیتر)",
      ar: "ماونتن ديو (٣٣٠ مل)"
    },
    category: "drinks",
    price: 3,
    unit: "330ml",
    weight: "330ml",
    description: {
      en: "Mountain Dew 330ml can",
      fa: "ماونتین دو ۳۳۰ میلی‌لیتر قوطی",
      ar: "علبة ماونتن ديو ٣٣٠ مل"
    },
    inStock: true
  },
  {
    code: "0057",
    name: {
      en: "Laban (300ml)",
      fa: "لبن (۳۰۰ میلی‌لیتر)",
      ar: "لبن (٣٠٠ مل)"
    },
    category: "drinks",
    price: 2,
    unit: "300ml",
    weight: "300ml",
    description: {
      en: "Laban 300ml",
      fa: "لبن ۳۰۰ میلی‌لیتر",
      ar: "لبن ٣٠٠ مل"
    },
    inStock: true
  },
  {
    code: "0058",
    name: {
      en: "Mineral Water (500ml)",
      fa: "آب معدنی (۵۰۰ میلی‌لیتر)",
      ar: "ماء معدني (٥٠٠ مل)"
    },
    category: "drinks",
    price: 2,
    unit: "500ml",
    weight: "500ml",
    description: {
      en: "Mineral water 500ml bottle",
      fa: "آب معدنی ۵۰۰ میلی‌لیتر بطری",
      ar: "قنينة ماء معدني ٥٠٠ مل"
    },
    inStock: true
  },
  // ===== سیخ‌ها (Skewers without side) =====
  {
    code: "0034",
    name: {
      en: "Mutton Kebab (1 Skewer)",
      fa: "کباب گوشت (۱ سیخ)",
      ar: "سيخ كباب لحم"
    },
    category: "main",
    price: 10,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Mutton kebab 1 skewer 100g",
      fa: "کباب گوشت ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ كباب لحم ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0035",
    name: {
      en: "Mutton Kofta (1 Skewer)",
      fa: "کوفته گوشت (۱ سیخ)",
      ar: "سيخ كفتة لحم"
    },
    category: "main",
    price: 9,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Mutton kofta 1 skewer 100g",
      fa: "کوفته گوشت ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ كفتة لحم ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0036",
    name: {
      en: "Spicy Mutton Kofta (1 Skewer)",
      fa: "کوفته گوشت تند (۱ سیخ)",
      ar: "سيخ كفتة لحم حارة"
    },
    category: "main",
    price: 9,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Spicy mutton kofta 1 skewer 100g",
      fa: "کوفته گوشت تند ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ كفتة لحم حارة ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0037",
    name: {
      en: "Lamb Chop (1 Piece)",
      fa: "ریش (۱ عدد)",
      ar: "ريش غنم (١ قطعة)"
    },
    category: "main",
    price: 10,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Lamb chop 1 piece 100g",
      fa: "ریش ۱ عدد ۱۰۰ گرم",
      ar: "ريش غنم ١ قطعة ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0038",
    name: {
      en: "Chicken Kebab (1 Skewer)",
      fa: "جوجه کباب (۱ سیخ)",
      ar: "سيخ شيش دجاج"
    },
    category: "main",
    price: 8,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Chicken kebab 1 skewer 100g",
      fa: "جوجه کباب ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ شيش دجاج ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0039",
    name: {
      en: "Yogurt Chicken (1 Skewer)",
      fa: "جوجه ماستی (۱ سیخ)",
      ar: "سيخ دجاج متبل باللبن"
    },
    category: "main",
    price: 8,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Yogurt marinated chicken 1 skewer 100g",
      fa: "جوجه ماستی ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ دجاج متبل باللبن ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0040",
    name: {
      en: "Chicken Kofta (1 Skewer)",
      fa: "کوفته مرغ (۱ سیخ)",
      ar: "سيخ كفتة دجاج"
    },
    category: "main",
    price: 8,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Chicken kofta 1 skewer 100g",
      fa: "کوفته مرغ ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ كفتة دجاج ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0041",
    name: {
      en: "Chicken Wing (1 Skewer)",
      fa: "بال مرغ (۱ سیخ)",
      ar: "سيخ أجنحة دجاج"
    },
    category: "main",
    price: 8,
    unit: "80g",
    weight: "80g",
    description: {
      en: "Chicken wing 1 skewer 80g",
      fa: "بال مرغ ۱ سیخ ۸۰ گرم",
      ar: "سيخ أجنحة دجاج ٨٠ غ"
    },
    inStock: true
  },
  {
    code: "0042",
    name: {
      en: "Spicy Chicken (1 Skewer)",
      fa: "جوجه تند (۱ سیخ)",
      ar: "سيخ دجاج حار"
    },
    category: "main",
    price: 8,
    unit: "100g",
    weight: "100g",
    description: {
      en: "Spicy chicken 1 skewer 100g",
      fa: "جوجه تند ۱ سیخ ۱۰۰ گرم",
      ar: "سيخ دجاج حار ١٠٠ غ"
    },
    inStock: true
  },
  {
    code: "0043",
    name: {
      en: "Liver-Kidney-Heart (1 Skewer)",
      fa: "جگر-کلیه-قلب (۱ سیخ)",
      ar: "سيخ كبدة وكلوي وقلوب"
    },
    category: "main",
    price: 8,
    unit: "80g",
    weight: "80g",
    description: {
      en: "Mixed liver, kidney and heart 1 skewer 80g",
      fa: "جگر و کلیه و قلب ۱ سیخ ۸۰ گرم",
      ar: "سيخ كبدة وكلوي وقلوب ٨٠ غ"
    },
    inStock: true
  }
];

async function seedDatabase() {
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

    await Dish.deleteMany({});
    console.log('🗑️ Previous dishes cleared');

    const result = await Dish.insertMany(menuData);
    console.log(`✅ ${result.length} dishes inserted successfully!`);

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

seedDatabase();
