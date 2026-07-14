import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const slugMap = {
  '0063': 'baja-dag',
  '0064': 'ash-sabzi',
  '0065': 'cheese-bread',
  '0066': 'zaatar-bread',
  '0067': 'foul-normal',
  '0068': 'liver',
  '0069': 'egg-bread-salad',
  '0070': 'omlet-tomato-paste',
  '0071': 'omlet-tomato',
  '0072': 'foul-egyptian',
  '0073': 'hummus-large',
  '0074': 'hummus-small',
  '0075': 'mahyawa-bread',
  '0001': 'mix-tikka',
  '0002': 'kofta-mutton',
  '0003': 'chicken-saffron',
  '0004': 'chicken-yogurt',
  '0005': 'lamb-chops',
  '0006': 'chicken-kofta',
  '0007': 'chicken-wings',
  '0008': 'kebab',
  '0009': 'chicken-saffron-rice',
  '0010': 'mix-grill-1',
  '0010-2': 'mix-grill-2',
  '0011': 'kofta-mutton-rice',
  '0012': 'chicken-kofta-rice',
  '0013': 'kabab-barg-rice',
  '0014': 'bbq-chicken-rice',
  '0015': 'bbq-chicken-bread',
  '0018': 'baja-dag-main',
  '0019': 'zershk-polo',
  '0020': 'okra-mutton',
  '0021': 'lentil-meat',
  '0022': 'kofta-mutton-sandwich',
  '0023': 'sandwich-mix',
  '0024': 'irani-rice-plate',
  '0025': 'liver-plate',
  '0026': 'liver-kidney',
  '0027': 'kabab-barg',
  '0028': 'hummus-plate',
  '0029': 'mahyawa-bread-3',
  '0030': 'salad-shirazi',
  '0031': 'halwa',
  '0032': 'yogurt-cucumber',
  '0033': 'garlic-yogurt',
  '0034': 'mutton-kebab-skewer',
  '0035': 'kofta-mutton-skewer',
  '0036': 'kofta-mutton-spicy',
  '0037': 'lamb-chop-skewer',
  '0038': 'chicken-kebab-skewer',
  '0039': 'chicken-yogurt-skewer',
  '0040': 'chicken-kofta-skewer',
  '0041': 'chicken-wing-skewer',
  '0042': 'spicy-chicken-skewer',
  '0043': 'liver-kidney-heart',
  '0044': 'tandoor-bread',
  '0045': 'cheese-bread-side',
  '0046': 'mahyawa-bread-side',
  '0047': 'rocca-salad',
  '0048': 'yogurt',
  '0049': 'hummus-side',
  '0050': 'salad-shirazi-side',
  '0051': 'yogurt-cucumber-side',
  '0052': 'garlic-yogurt-side',
  '0059': 'side-dish',
  '0060': 'salad',
  '0061': 'irani-bread',
  '0062': 'french-fries',
  '0053': 'tea',
  '0054': 'pepsi',
  '0055': '7up',
  '0056': 'mountain-dew',
  '0057': 'leben',
  '0058': 'water-small'
};

async function addSlugs() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant';
    await mongoose.connect(uri);
    console.log('✅ Connected to database');

    const dishSchema = new mongoose.Schema({}, { strict: false });
    const Dish = mongoose.model('Dish', dishSchema, 'dishes');

    let updated = 0;
    let skipped = 0;

    for (const [code, slug] of Object.entries(slugMap)) {
      const result = await Dish.updateOne(
        { code: code },
        { $set: { slug: slug } }
      );
      if (result.modifiedCount > 0) {
        updated++;
        console.log(`✅ ${code} → ${slug}`);
      } else {
        skipped++;
      }
    }

    console.log(`\n📊 نتیجه: ${updated} آیتم به‌روزرسانی شد، ${skipped} آیتم یافت نشد`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addSlugs();
