import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Dish from '../models/Dish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const menuData = [
  { code: "0063", name: { en: "Hot Paya Stew with Bread & Salad", fa: "باجه داغ با سالاد و نان", ar: "باجة ساخنة مع السلطة والخبز" }, category: "breakfast", price: 75, unit: "Full", description: { en: "Traditional hot paya stew served with fresh bread and salad", fa: "باجه داغ سنتی همراه با نان و سالاد تازه", ar: "يخنة باجة ساخنة تقليدية تقدم مع خبز طازج وسلطة" } },
  { code: "0064", name: { en: "Shirazi Herb Soup", fa: "آش سبزی شیرازی", ar: "آش سبزي شيرازي" }, category: "breakfast", price: 18, unit: "500g", description: { en: "Traditional Shirazi herb soup with bread", fa: "آش سبزی شیرازی سنتی با نان", ar: "حساء الأعشاب الشيرازي التقليدي مع الخبز" } },
  { code: "0065", name: { en: "Cheese Bread", fa: "نان پنیری", ar: "خبز بالجبن" }, category: "breakfast", price: 6, unit: "1pc", description: { en: "Freshly baked bread with cheese filling", fa: "نان تازه با پنیر آب شده", ar: "خبز طازج محشو بالجبن" } },
  { code: "0066", name: { en: "Zaatar Bread", fa: "نان زعتر", ar: "خبز بالزعتر" }, category: "breakfast", price: 6, unit: "1pc", description: { en: "Bread with zaatar spice mixture", fa: "نان با مخلوط ادویه زعتر", ar: "خبز مع خليط الزعتر" } },
  { code: "0067", name: { en: "Traditional Foul", fa: "فول معمولی", ar: "فول عادي" }, category: "breakfast", price: 18, unit: "400g", description: { en: "Traditional fava beans with spices", fa: "باقالا سنتی با ادویه", ar: "فول تقليدي مع البهارات" } },
  { code: "0068", name: { en: "Grilled Liver", fa: "جگر کبابی", ar: "كبدة مشوية" }, category: "breakfast", price: 30, unit: "350g", description: { en: "Grilled liver with spices", fa: "جگر کبابی با ادویه", ar: "كبدة مشوية مع البهارات" } },
  { code: "0069", name: { en: "Egg with Bread & Salad", fa: "تخم‌مرغ با نان و سالاد", ar: "بيض مع خبز وسلطة" }, category: "breakfast", price: 15, unit: "-", description: { en: "Eggs served with bread and salad", fa: "تخم‌مرغ همراه با نان و سالاد", ar: "بيض يقدم مع خبز وسلطة" } },
  { code: "0070", name: { en: "Tomato Paste Omelette", fa: "املت با رب گوجه", ar: "عجة بالبيض ومعجون الطماطم" }, category: "breakfast", price: 18, unit: "-", description: { en: "Omelette with tomato paste", fa: "املت با رب گوجه فرنگی", ar: "عجة بالبيض مع معجون الطماطم" } },
  { code: "0071", name: { en: "Fresh Tomato Omelette", fa: "املت با گوجه فرنگی", ar: "عجة بالطماطم الطازجة" }, category: "breakfast", price: 20, unit: "-", description: { en: "Omelette with fresh tomatoes", fa: "املت با گوجه فرنگی تازه", ar: "عجة بالطماطم الطازجة" } },
  { code: "0072", name: { en: "Egyptian Foul", fa: "فول مصری", ar: "فول مصري" }, category: "breakfast", price: 20, unit: "-", description: { en: "Egyptian style fava beans", fa: "باقالا به سبک مصری", ar: "فول على الطريقة المصرية" } },
  { code: "0073", name: { en: "Hummus (Large)", fa: "حمص بزرگ", ar: "حمص كبير" }, category: "breakfast", price: 8, unit: "500g", description: { en: "Creamy hummus with olive oil", fa: "حمص با روغن زیتون", ar: "حمص مع زيت الزيتون" } },
  { code: "0074", name: { en: "Hummus (Small)", fa: "حمص کوچک", ar: "حمص صغير" }, category: "breakfast", price: 8, unit: "200g", description: { en: "Creamy hummus with olive oil", fa: "حمص با روغن زیتون", ar: "حمص مع زيت الزيتون" } },
  { code: "0075", name: { en: "Mahyawa Bread", fa: "نان ماهیانه", ar: "خبز مهياوه" }, category: "breakfast", price: 4, unit: "1pc", description: { en: "Traditional Mahyawa bread", fa: "نان ماهیانه سنتی", ar: "خبز مهياوه تقليدي" } },

  { code: "0001", name: { en: "Mixed Tikka (6 Skewers)", fa: "میکس تیکا (۶ سیخ)", ar: "مشاوي مشكلة (٦ سيخ)" }, category: "main", price: 69, unit: "One Plate", description: { en: "Mixed tikka with 6 skewers", fa: "میکس تیکا با ۶ سیخ", ar: "مشاوي مشكلة مع ٦ سيخ" } },
  { code: "0002", name: { en: "Mutton Kofta (4 Skewers)", fa: "کوفته گوشت (۴ سیخ)", ar: "كفتة لحم (٤ سيخ)" }, category: "main", price: 45, unit: "4 Skewer", description: { en: "Minced mutton kofta with spices", fa: "کوفته گوشت چرخ کرده با ادویه", ar: "كفتة لحم مفروم مع البهارات" } },
  { code: "0003", name: { en: "Saffron Chicken Kebab (4 Skewers)", fa: "جوجه زعفرانی (۴ سیخ)", ar: "دجاج بالزعفران (٤ سيخ)" }, category: "main", price: 40, unit: "4 Skewer", description: { en: "Saffron marinated chicken kebab", fa: "جوجه کباب با زعفران", ar: "شيش دجاج متبل بالزعفران" } },
  { code: "0004", name: { en: "Yogurt-Marinated Chicken (4 Skewers)", fa: "جوجه ماستی (۴ سیخ)", ar: "دجاج متبل باللبن (٤ سيخ)" }, category: "main", price: 40, unit: "4 Skewer", description: { en: "Yogurt marinated chicken kebab", fa: "جوجه کباب با ماست", ar: "شيش دجاج متبل باللبن" } },
  { code: "0005", name: { en: "Grilled Lamb Chops (4 Pieces)", fa: "ریش گوسفندی کبابی (۴ عدد)", ar: "ريش غنم مشوي (٤ قطع)" }, category: "main", price: 69, unit: "4 Pieces", description: { en: "Grilled lamb chops with spices", fa: "ریش گوسفندی کبابی با ادویه", ar: "ريش غنم مشوي مع البهارات" } },
  { code: "0006", name: { en: "Chicken Kofta (4 Skewers)", fa: "کوفته مرغ (۴ سیخ)", ar: "كفتة دجاج (٤ سيخ)" }, category: "main", price: 40, unit: "4 Skewer", description: { en: "Minced chicken kofta with spices", fa: "کوفته مرغ چرخ کرده با ادویه", ar: "كفتة دجاج مفروم مع البهارات" } },
  { code: "0007", name: { en: "Grilled Chicken Wings (4 Skewers)", fa: "بال مرغ کبابی (۴ سیخ)", ar: "أجنحة دجاج مشوية (٤ سيخ)" }, category: "main", price: 35, unit: "4 Skewer", description: { en: "Grilled chicken wings with spices", fa: "بال مرغ کبابی با ادویه", ar: "أجنحة دجاج مشوية مع البهارات" } },
  { code: "0008", name: { en: "Traditional Kebab (4 Skewers)", fa: "کباب سنتی (۴ سیخ)", ar: "كباب تقليدي (٤ سيخ)" }, category: "main", price: 45, unit: "4 Skewer", description: { en: "Traditional kebab with spices", fa: "کباب سنتی با ادویه", ar: "كباب تقليدي مع البهارات" } },
  { code: "0009", name: { en: "Saffron Chicken Kebab with Rice", fa: "جوجه زعفرانی با برنج", ar: "شيش دجاج بالزعفران مع الأرز" }, category: "main", price: 35, unit: "One Plate", description: { en: "Saffron chicken kebab served with rice", fa: "جوجه زعفرانی کباب با برنج", ar: "شيش دجاج بالزعفران يقدم مع الأرز" } },
  { code: "0010", name: { en: "Mix Grill (1 Person, 4 skewers)", fa: "میکس گریل (۱ نفر، ۴ سیخ)", ar: "مشاوي مشكل (شخص واحد، ٤ سيخ)" }, category: "main", price: 40, unit: "1 Person", description: { en: "Mixed grill for 1 person with 4 skewers", fa: "میکس گریل برای ۱ نفر با ۴ سیخ", ar: "مشاوي مشكل لشخص واحد مع ٤ سيخ" } },
  { code: "0010-2", name: { en: "Mix Grill (2 Persons, 8 skewers)", fa: "میکس گریل (۲ نفر، ۸ سیخ)", ar: "مشاوي مشكل (شخصين، ٨ سيخ)" }, category: "main", price: 70, unit: "2 Persons", description: { en: "Mixed grill for 2 persons with 8 skewers", fa: "میکس گریل برای ۲ نفر با ۸ سیخ", ar: "مشاوي مشكل لشخصين مع ٨ سيخ" } },
  { code: "0011", name: { en: "Mutton Kofta with Rice", fa: "کوفته گوشت با برنج", ar: "كفتة لحم مع الأرز" }, category: "main", price: 40, unit: "One Plate", description: { en: "Mutton kofta served with rice", fa: "کوفته گوشت با برنج", ar: "كفتة لحم تقدم مع الأرز" } },
  { code: "0012", name: { en: "Chicken Kofta with Rice", fa: "کوفته مرغ با برنج", ar: "كفتة دجاج مع الأرز" }, category: "main", price: 35, unit: "One Plate", description: { en: "Chicken kofta served with rice", fa: "کوفته مرغ با برنج", ar: "كفتة دجاج تقدم مع الأرز" } },
  { code: "0013", name: { en: "Barg Kebab with Rice", fa: "کباب برگ با برنج", ar: "كباب برك مع الأرز" }, category: "main", price: 75, unit: "-", description: { en: "Persian style barg kebab served with rice", fa: "کباب برگ ایرانی با برنج", ar: "كباب برك إيراني يقدم مع الأرز" } },
  { code: "0014", name: { en: "BBQ Chicken with Rice", fa: "جوجه کباب با برنج", ar: "دجاج مشوي مع الأرز" }, category: "main", price: 35, unit: "-", description: { en: "BBQ chicken served with rice", fa: "جوجه کباب با برنج", ar: "دجاج مشوي يقدم مع الأرز" } },
  { code: "0015", name: { en: "BBQ Chicken with Bread", fa: "جوجه کباب با نان", ar: "دجاج مشوي مع الخبز" }, category: "main", price: 30, unit: "-", description: { en: "BBQ chicken served with bread", fa: "جوجه کباب با نان", ar: "دجاج مشوي يقدم مع الخبز" } },
  { code: "0018", name: { en: "Hot Paya Stew with Bread & Salad (Full)", fa: "باجه داغ با سالاد و نان کامل", ar: "باجة ساخنة كاملة مع السلطة والخبز" }, category: "main", price: 75, unit: "Full", description: { en: "Traditional hot paya stew with bread and salad", fa: "باجه داغ سنتی با سالاد و نان", ar: "يخنة باجة ساخنة تقليدية مع الخبز والسلطة" } },
  { code: "0019", name: { en: "Barberry Rice", fa: "زرشک پلو", ar: "أرز بالزرشك" }, category: "main", price: 35, unit: "-", description: { en: "Persian barberry rice", fa: "زرشک پلو ایرانی", ar: "أرز بالزرشك على الطريقة الإيرانية" } },
  { code: "0020", name: { en: "Okra Stew with Mutton", fa: "خورش بامیه با گوشت", ar: "يخنة بامية باللحم" }, category: "main", price: 30, unit: "-", description: { en: "Okra stew with mutton served with rice", fa: "خورش بامیه با گوشت و برنج", ar: "يخنة بامية باللحم تقدم مع الأرز" } },
  { code: "0021", name: { en: "Lentil Stew with Meat", fa: "خورش عدس با گوشت", ar: "يخنة عدس باللحم" }, category: "main", price: 30, unit: "-", description: { en: "Lentil stew with meat served with rice", fa: "خورش عدس با گوشت و برنج", ar: "يخنة عدس باللحم تقدم مع الأرز" } },
  { code: "0022", name: { en: "Kofta Mutton Sandwich", fa: "ساندویچ کوفته گوشت", ar: "ساندوتش كفتة لحم الضأن" }, category: "main", price: 15, unit: "One Plate", description: { en: "Mutton kofta sandwich", fa: "ساندویچ کوفته گوشت", ar: "ساندوتش كفتة لحم الضأن" } },
  { code: "0023", name: { en: "Sandwich (Mutton/Chicken/Kofta)", fa: "ساندویچ (گوشت/مرغ/کوفته)", ar: "ساندوتش (لحم/دجاج/كفتة)" }, category: "main", price: 45, unit: "3 Pieces", description: { en: "3 sandwiches with choice of mutton, chicken or kofta", fa: "۳ ساندویچ با انتخاب گوشت، مرغ یا کوفته", ar: "٣ ساندوتش مع اختيار لحم أو دجاج أو كفتة" } },
  { code: "0024", name: { en: "Irani Rice Plate", fa: "طبق برنج ایرانی", ar: "طبق أرز إيراني" }, category: "main", price: 15, unit: "800g", description: { en: "Persian style rice plate 800g", fa: "طبق برنج ایرانی ۸۰۰ گرم", ar: "طبق أرز إيراني ٨٠٠ غ" } },
  { code: "0025", name: { en: "Grilled Liver (350g)", fa: "جگر کبابی ۳۵۰ گرم", ar: "كبدة مشوية ٣٥٠ غ" }, category: "main", price: 30, unit: "350g", description: { en: "Grilled liver with spices", fa: "جگر کبابی با ادویه", ar: "كبدة مشوية مع البهارات" } },
  { code: "0026", name: { en: "Grilled Liver & Kidney", fa: "جگر و کلیه کبابی", ar: "كبدة و كلاوي مشوية" }, category: "main", price: 35, unit: "One Plate", description: { en: "Grilled liver and kidney with spices", fa: "جگر و کلیه کبابی با ادویه", ar: "كبدة و كلاوي مشوية مع البهارات" } },
  { code: "0027", name: { en: "Barg Kebab", fa: "کباب برگ", ar: "كباب برك" }, category: "main", price: 65, unit: "One Set", description: { en: "Persian style barg kebab", fa: "کباب برگ ایرانی", ar: "كباب برك إيراني" } },

  { code: "0016", name: { en: "Mixed Grill Oval Tray (10 Persons)", fa: "سینی بیضی مخلوط (۱۰ نفر)", ar: "صينية مشاوي بيضاوية (١٠ أشخاص)" }, category: "combo", price: 500, unit: "10 Persons", description: { en: "Mixed grill oval tray for 10 persons with rice", fa: "سینی بیضی مخلوط برای ۱۰ نفر با برنج", ar: "صينية مشاوي بيضاوية لـ ١٠ أشخاص مع الأرز" } },
  { code: "0016-2", name: { en: "Mixed Grill Oval Tray (15 Persons)", fa: "سینی بیضی مخلوط (۱۵ نفر)", ar: "صينية مشاوي بيضاوية (١٥ أشخاص)" }, category: "combo", price: 750, unit: "15 Persons", description: { en: "Mixed grill oval tray for 15 persons with rice", fa: "سینی بیضی مخلوط برای ۱۵ نفر با برنج", ar: "صينية مشاوي بيضاوية لـ ١٥ أشخاص مع الأرز" } },
  { code: "0016-3", name: { en: "Mixed Grill Oval Tray (20 Persons)", fa: "سینی بیضی مخلوط (۲۰ نفر)", ar: "صينية مشاوي بيضاوية (٢٠ أشخاص)" }, category: "combo", price: 1000, unit: "20 Persons", description: { en: "Mixed grill oval tray for 20 persons with rice", fa: "سینی بیضی مخلوط برای ۲۰ نفر با برنج", ar: "صينية مشاوي بيضاوية لـ ٢٠ أشخاص مع الأرز" } },
  { code: "0017", name: { en: "Mixed Grill Round Tray (5 Persons)", fa: "سینی گرد مخلوط (۵ نفر)", ar: "صينية مشاوي مدورة (٥ أشخاص)" }, category: "combo", price: 260, unit: "5 Persons", description: { en: "Mixed grill round tray for 5 persons with rice", fa: "سینی گرد مخلوط برای ۵ نفر با برنج", ar: "صينية مشاوي مدورة لـ ٥ أشخاص مع الأرز" } },

  { code: "0028", name: { en: "Hummus (Large Plate)", fa: "حمص (طبق بزرگ)", ar: "حمص (طبق كبير)" }, category: "appetizer", price: 9, unit: "One Plate", description: { en: "Creamy hummus with olive oil", fa: "حمص با روغن زیتون", ar: "حمص مع زيت الزيتون" } },
  { code: "0029", name: { en: "Mahyawa Bread (3 breads)", fa: "نان ماهیانه (۳ عدد)", ar: "خبز مهياوه (٣ أرغفة)" }, category: "appetizer", price: 15, unit: "3 Breads", description: { en: "Traditional Mahyawa bread 3 pieces", fa: "نان ماهیانه سنتی ۳ عدد", ar: "خبز مهياوه تقليدي ٣ أرغفة" } },
  { code: "0030", name: { en: "Shirazi Salad", fa: "سالاد شیرازی", ar: "سلطة شيرازي" }, category: "appetizer", price: 8, unit: "One Plate", description: { en: "Traditional Shirazi salad with cucumber and tomato", fa: "سالاد شیرازی با خیار و گوجه", ar: "سلطة شيرازي مع خيار و طماطم" } },
  { code: "0031", name: { en: "Halwa", fa: "حلوا", ar: "حلوة" }, category: "appetizer", price: 8, unit: "300g", description: { en: "Traditional Persian halwa", fa: "حلوا سنتی ایرانی", ar: "حلوة فارسية تقليدية" } },
  { code: "0032", name: { en: "Yogurt and Cucumber", fa: "ماست و خیار", ar: "روب و خيار" }, category: "appetizer", price: 8, unit: "One Plate", description: { en: "Yogurt with cucumber and mint", fa: "ماست با خیار و نعناع", ar: "روب مع خيار و نعناع" } },
  { code: "0033", name: { en: "Garlic Yogurt", fa: "ماست سیر", ar: "روب ثوم" }, category: "appetizer", price: 8, unit: "One Plate", description: { en: "Yogurt with garlic", fa: "ماست با سیر", ar: "روب مع ثوم" } },

  { code: "0034", name: { en: "Mutton Kebab (1 Skewer)", fa: "کباب گوشت (۱ سیخ)", ar: "سيخ كباب لحم" }, category: "main", price: 10, unit: "100g", description: { en: "Mutton kebab 1 skewer 100g", fa: "کباب گوشت ۱ سیخ ۱۰۰ گرم", ar: "سيخ كباب لحم ١٠٠ غ" } },
  { code: "0035", name: { en: "Mutton Kofta (1 Skewer)", fa: "کوفته گوشت (۱ سیخ)", ar: "سيخ كفتة لحم" }, category: "main", price: 9, unit: "100g", description: { en: "Mutton kofta 1 skewer 100g", fa: "کوفته گوشت ۱ سیخ ۱۰۰ گرم", ar: "سيخ كفتة لحم ١٠٠ غ" } },
  { code: "0036", name: { en: "Spicy Mutton Kofta (1 Skewer)", fa: "کوفته گوشت تند (۱ سیخ)", ar: "سيخ كفتة لحم حارة" }, category: "main", price: 9, unit: "100g", description: { en: "Spicy mutton kofta 1 skewer 100g", fa: "کوفته گوشت تند ۱ سیخ ۱۰۰ گرم", ar: "سيخ كفتة لحم حارة ١٠٠ غ" } },
  { code: "0037", name: { en: "Lamb Chop (1 Piece)", fa: "ریش (۱ عدد)", ar: "ريش غنم (١ قطعة)" }, category: "main", price: 10, unit: "100g", description: { en: "Lamb chop 1 piece 100g", fa: "ریش ۱ عدد ۱۰۰ گرم", ar: "ريش غنم ١ قطعة ١٠٠ غ" } },
  { code: "0038", name: { en: "Chicken Kebab (1 Skewer)", fa: "جوجه کباب (۱ سیخ)", ar: "سيخ شيش دجاج" }, category: "main", price: 8, unit: "100g", description: { en: "Chicken kebab 1 skewer 100g", fa: "جوجه کباب ۱ سیخ ۱۰۰ گرم", ar: "سيخ شيش دجاج ١٠٠ غ" } },
  { code: "0039", name: { en: "Yogurt Chicken (1 Skewer)", fa: "جوجه ماستی (۱ سیخ)", ar: "سيخ دجاج متبل باللبن" }, category: "main", price: 8, unit: "100g", description: { en: "Yogurt marinated chicken 1 skewer 100g", fa: "جوجه ماستی ۱ سیخ ۱۰۰ گرم", ar: "سيخ دجاج متبل باللبن ١٠٠ غ" } },
  { code: "0040", name: { en: "Chicken Kofta (1 Skewer)", fa: "کوفته مرغ (۱ سیخ)", ar: "سيخ كفتة دجاج" }, category: "main", price: 8, unit: "100g", description: { en: "Chicken kofta 1 skewer 100g", fa: "کوفته مرغ ۱ سیخ ۱۰۰ گرم", ar: "سيخ كفتة دجاج ١٠٠ غ" } },
  { code: "0041", name: { en: "Chicken Wing (1 Skewer)", fa: "بال مرغ (۱ سیخ)", ar: "سيخ أجنحة دجاج" }, category: "main", price: 8, unit: "80g", description: { en: "Chicken wing 1 skewer 80g", fa: "بال مرغ ۱ سیخ ۸۰ گرم", ar: "سيخ أجنحة دجاج ٨٠ غ" } },
  { code: "0042", name: { en: "Spicy Chicken (1 Skewer)", fa: "جوجه تند (۱ سیخ)", ar: "سيخ دجاج حار" }, category: "main", price: 8, unit: "100g", description: { en: "Spicy chicken 1 skewer 100g", fa: "جوجه تند ۱ سیخ ۱۰۰ گرم", ar: "سيخ دجاج حار ١٠٠ غ" } },
  { code: "0043", name: { en: "Liver-Kidney-Heart (1 Skewer)", fa: "جگر-کلیه-قلب (۱ سیخ)", ar: "سيخ كبدة وكلوي وقلوب" }, category: "main", price: 8, unit: "80g", description: { en: "Mixed liver, kidney and heart 1 skewer 80g", fa: "جگر و کلیه و قلب ۱ سیخ ۸۰ گرم", ar: "سيخ كبدة وكلوي وقلوب ٨٠ غ" } },

  { code: "0044", name: { en: "Tandoor Bread Irani", fa: "نان تندوری ایرانی", ar: "خبز تندوري إيراني" }, category: "appetizer", price: 1, unit: "150g", description: { en: "Traditional Iranian tandoor bread 150g", fa: "نان تندوری ایرانی ۱۵۰ گرم", ar: "خبز تندوري إيراني ١٥٠ غ" } },
  { code: "0045", name: { en: "Cheese Bread (Side)", fa: "نان پنیری", ar: "خبز جبن" }, category: "appetizer", price: 5, unit: "-", description: { en: "Bread with cheese filling", fa: "نان با پنیر", ar: "خبز مع جبن" } },
  { code: "0046", name: { en: "Mahyawa Bread (Side)", fa: "نان ماهیانه", ar: "خبز مهياوه" }, category: "appetizer", price: 3, unit: "-", description: { en: "Traditional Mahyawa bread", fa: "نان ماهیانه سنتی", ar: "خبز مهياوه تقليدي" } },
  { code: "0047", name: { en: "Rocca Salad", fa: "سالاد روکا", ar: "سلطة جرجير" }, category: "appetizer", price: 5, unit: "100g", description: { en: "Fresh arugula salad", fa: "سالاد روکا تازه", ar: "سلطة جرجير طازجة" } },
  { code: "0048", name: { en: "Yogurt", fa: "ماست", ar: "روب" }, category: "appetizer", price: 5, unit: "500g", description: { en: "Plain yogurt 500g", fa: "ماست ساده ۵۰۰ گرم", ar: "روب عادي ٥٠٠ غ" } },
  { code: "0049", name: { en: "Hummus (Side)", fa: "حمص", ar: "حمص" }, category: "appetizer", price: 8, unit: "-", description: { en: "Creamy hummus with olive oil", fa: "حمص با روغن زیتون", ar: "حمص مع زيت الزيتون" } },
  { code: "0050", name: { en: "Shirazi Salad (300g)", fa: "سالاد شیرازی ۳۰۰ گرم", ar: "سلطة شيرازي ٣٠٠ غ" }, category: "appetizer", price: 8, unit: "300g", description: { en: "Traditional Shirazi salad 300g", fa: "سالاد شیرازی ۳۰۰ گرم", ar: "سلطة شيرازي ٣٠٠ غ" } },
  { code: "0051", name: { en: "Yogurt and Cucumber (500g)", fa: "ماست و خیار ۵۰۰ گرم", ar: "روب و خيار ٥٠٠ غ" }, category: "appetizer", price: 8, unit: "500g", description: { en: "Yogurt with cucumber and mint 500g", fa: "ماست با خیار و نعناع ۵۰۰ گرم", ar: "روب مع خيار و نعناع ٥٠٠ غ" } },
  { code: "0052", name: { en: "Garlic Yogurt (500g)", fa: "ماست سیر ۵۰۰ گرم", ar: "روب مع ثوم ٥٠٠ غ" }, category: "appetizer", price: 8, unit: "500g", description: { en: "Yogurt with garlic 500g", fa: "ماست با سیر ۵۰۰ گرم", ar: "روب مع ثوم ٥٠٠ غ" } },
  { code: "0059", name: { en: "Side Dish", fa: "طبق جانبی", ar: "طباق جانبية" }, category: "appetizer", price: 7, unit: "-", description: { en: "Assorted side dish", fa: "طبق جانبی متنوع", ar: "طباق جانبية متنوعة" } },
  { code: "0060", name: { en: "Salad", fa: "سالاد", ar: "سلطة" }, category: "appetizer", price: 5, unit: "-", description: { en: "Fresh green salad", fa: "سالاد سبزیجات تازه", ar: "سلطة خضراء طازجة" } },
  { code: "0061", name: { en: "Irani Bread (1pc)", fa: "نان ایرانی (۱ عدد)", ar: "خبز إيراني (١ قطعة)" }, category: "appetizer", price: 1, unit: "1pc", description: { en: "Traditional Iranian bread 1 piece", fa: "نان ایرانی ۱ عدد", ar: "خبز إيراني ١ قطعة" } },
  { code: "0062", name: { en: "French Fries", fa: "سیب‌زمینی سرخ کرده", ar: "بطاطس مقلية" }, category: "appetizer", price: 10, unit: "-", description: { en: "Crispy french fries", fa: "سیب‌زمینی سرخ کرده ترد", ar: "بطاطس مقلية مقرمشة" } },

  { code: "0053", name: { en: "Hot Tea", fa: "چای داغ", ar: "شاي ساخن" }, category: "drinks", price: 3, unit: "-", description: { en: "Traditional hot tea", fa: "چای داغ سنتی", ar: "شاي ساخن تقليدي" } },
  { code: "0054", name: { en: "Pepsi (330ml)", fa: "پپسی (۳۳۰ میلی‌لیتر)", ar: "بيبسي (٣٣٠ مل)" }, category: "drinks", price: 3, unit: "330ml", description: { en: "Pepsi 330ml can", fa: "پپسی ۳۳۰ میلی‌لیتر قوطی", ar: "علبة بيبسي ٣٣٠ مل" } },
  { code: "0055", name: { en: "7up (330ml)", fa: "سون آپ (۳۳۰ میلی‌لیتر)", ar: "سفن أب (٣٣٠ مل)" }, category: "drinks", price: 3, unit: "330ml", description: { en: "7up 330ml can", fa: "سون آپ ۳۳۰ میلی‌لیتر قوطی", ar: "علبة سفن أب ٣٣٠ مل" } },
  { code: "0056", name: { en: "Mountain Dew (330ml)", fa: "ماونتین دو (۳۳۰ میلی‌لیتر)", ar: "ماونتن ديو (٣٣٠ مل)" }, category: "drinks", price: 3, unit: "330ml", description: { en: "Mountain Dew 330ml can", fa: "ماونتین دو ۳۳۰ میلی‌لیتر قوطی", ar: "علبة ماونتن ديو ٣٣٠ مل" } },
  { code: "0057", name: { en: "Laban (300ml)", fa: "لبن (۳۰۰ میلی‌لیتر)", ar: "لبن (٣٠٠ مل)" }, category: "drinks", price: 2, unit: "300ml", description: { en: "Laban 300ml", fa: "لبن ۳۰۰ میلی‌لیتر", ar: "لبن ٣٠٠ مل" } },
  { code: "0058", name: { en: "Mineral Water (500ml)", fa: "آب معدنی (۵۰۰ میلی‌لیتر)", ar: "ماء معدني (٥٠٠ مل)" }, category: "drinks", price: 2, unit: "500ml", description: { en: "Mineral water 500ml bottle", fa: "آب معدنی ۵۰۰ میلی‌لیتر بطری", ar: "قنينة ماء معدني ٥٠٠ مل" } },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    let created = 0, updated = 0;
    for (const item of menuData) {
      const result = await Dish.findOneAndUpdate(
        { code: item.code },
        item,
        { upsert: true, new: true, rawResult: true }
      );
      if (result.lastErrorObject && result.lastErrorObject.updatedExisting) updated++;
      else created++;
    }

    console.log(`Done. Created: ${created}, Updated: ${updated}, Total: ${menuData.length}`);

    const stats = await Dish.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('Menu Statistics:');
    stats.forEach((s) => console.log(`  ${s._id}: ${s.count} items`));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
