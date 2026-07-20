import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from '../models/Dish.js';

dotenv.config();

const menuData = [
  // ===== Breakfast =====
  { code: "0063", name_en: "Hot Paya Stew with Bread & Salad (Baja Dag)", price: 75, unit: "Full", category: "breakfast" },
  { code: "0064", name_en: "Shirazi Herb Soup (Ash Sabzi Shirazi Dagh)", price: 18, unit: "500g", category: "breakfast" },
  { code: "0065", name_en: "Cheese Bread", price: 6, unit: "1pc", category: "breakfast" },
  { code: "0066", name_en: "Zaatar Bread", price: 6, unit: "1pc", category: "breakfast" },
  { code: "0067", name_en: "Traditional Foul (Foul)", price: 18, unit: "400g", category: "breakfast" },
  { code: "0068", name_en: "Grilled Liver", price: 30, unit: "350g", category: "breakfast" },
  { code: "0069", name_en: "Egg with Bread & Salad", price: 15, unit: "-", category: "breakfast" },
  { code: "0070", name_en: "Tomato Paste Omelette", price: 18, unit: "-", category: "breakfast" },
  { code: "0071", name_en: "Fresh Tomato Omelette", price: 20, unit: "-", category: "breakfast" },
  { code: "0072", name_en: "Egyptian Foul (Foul Masri)", price: 20, unit: "-", category: "breakfast" },
  { code: "0073", name_en: "Hummus (Large) (Hummus)", price: 8, unit: "500g", category: "breakfast" },
  { code: "0074", name_en: "Hummus (Small) (Hummus)", price: 8, unit: "200g", category: "breakfast" },
  { code: "0075", name_en: "Mahyawa Bread (Khubz Mahyawa)", price: 4, unit: "1pc", category: "breakfast" },

  // ===== Main =====
  { code: "0001", name_en: "Mixed Tikka (6 Skewers) (Mix Tikka)", price: 69, unit: "One Plate", category: "main" },
  { code: "0002", name_en: "Mutton Kofta (4 Skewers) (Kofta Lahm)", price: 45, unit: "4 Skewer", category: "main" },
  { code: "0003", name_en: "Saffron Chicken Kebab (4 Skewers) (Dajaj Zafaran)", price: 40, unit: "4 Skewer", category: "main" },
  { code: "0004", name_en: "Yogurt-Marinated Chicken (4 Skewers) (Dajaj Laban)", price: 40, unit: "4 Skewer", category: "main" },
  { code: "0005", name_en: "Grilled Lamb Chops (4 Pieces) (Reesh)", price: 69, unit: "4 Pieces", category: "main" },
  { code: "0006", name_en: "Chicken Kofta (4 Skewers) (Kofta Dajaj)", price: 40, unit: "4 Skewer", category: "main" },
  { code: "0007", name_en: "Grilled Chicken Wings (4 Skewers) (Ajniha Dajaj)", price: 35, unit: "4 Skewer", category: "main" },
  { code: "0008", name_en: "Traditional Kebab (4 Skewers) (Kabab)", price: 45, unit: "4 Skewer", category: "main" },
  { code: "0009", name_en: "Saffron Chicken Kebab with Rice (Dajaj Zafaran)", price: 35, unit: "One Plate", category: "main" },
  { code: "0010", name_en: "Mix Grill (1 Person, 4 skewers) (Mashawi Mishkal)", price: 40, unit: "1 Person", category: "main" },
  { code: "0010-2", name_en: "Mix Grill (2 Persons, 8 skewers) (Mashawi Mishkal)", price: 70, unit: "2 Persons", category: "main" },
  { code: "0011", name_en: "Mutton Kofta with Rice (Kofta Lahm)", price: 40, unit: "One Plate", category: "main" },
  { code: "0012", name_en: "Chicken Kofta with Rice (Kofta Dajaj)", price: 35, unit: "One Plate", category: "main" },
  { code: "0013", name_en: "Barg Kebab with Rice (Kabab Barg Irani)", price: 75, unit: "-", category: "main" },
  { code: "0014", name_en: "BBQ Chicken with Rice (Dajaj Mashwi)", price: 35, unit: "-", category: "main" },
  { code: "0015", name_en: "BBQ Chicken with Bread (Dajaj Mashwi)", price: 30, unit: "-", category: "main" },
  { code: "0018", name_en: "Hot Paya Stew with Bread & Salad (Full) (Baja Dag)", price: 75, unit: "Full", category: "main" },
  { code: "0019", name_en: "Barberry Rice (Zershk Polo Irani)", price: 35, unit: "-", category: "main" },
  { code: "0020", name_en: "Okra Stew with Mutton (Khoresh Bamieh)", price: 30, unit: "-", category: "main" },
  { code: "0021", name_en: "Lentil Stew with Meat (Gheimeh Irani)", price: 30, unit: "-", category: "main" },
  { code: "0022", name_en: "Kofta Mutton Sandwich", price: 15, unit: "One Plate", category: "main" },
  { code: "0023", name_en: "Sandwich (Mutton/Chicken/Kofta)", price: 45, unit: "3 Pieces", category: "main" },
  { code: "0024", name_en: "Irani Rice Plate", price: 15, unit: "800g", category: "main" },
  { code: "0025", name_en: "Grilled Liver (350g)", price: 30, unit: "350g", category: "main" },
  { code: "0026", name_en: "Grilled Liver & Kidney", price: 35, unit: "One Plate", category: "main" },
  { code: "0027", name_en: "Barg Kebab (Kabab Barg Irani)", price: 65, unit: "One Set", category: "main" },
  { code: "0034", name_en: "Mutton Kebab (1 Skewer)", price: 10, unit: "100g", category: "main" },
  { code: "0035", name_en: "Mutton Kofta (1 Skewer)", price: 9, unit: "100g", category: "main" },
  { code: "0036", name_en: "Spicy Mutton Kofta (1 Skewer)", price: 9, unit: "100g", category: "main" },
  { code: "0037", name_en: "Lamb Chop (1 Piece) (Reesh)", price: 10, unit: "100g", category: "main" },
  { code: "0038", name_en: "Chicken Kebab (1 Skewer)", price: 8, unit: "100g", category: "main" },
  { code: "0039", name_en: "Yogurt Chicken (1 Skewer)", price: 8, unit: "100g", category: "main" },
  { code: "0040", name_en: "Chicken Kofta (1 Skewer)", price: 8, unit: "100g", category: "main" },
  { code: "0041", name_en: "Chicken Wing (1 Skewer)", price: 8, unit: "80g", category: "main" },
  { code: "0042", name_en: "Spicy Chicken (1 Skewer)", price: 8, unit: "100g", category: "main" },
  { code: "0043", name_en: "Liver-Kidney-Heart (1 Skewer)", price: 8, unit: "80g", category: "main" },

  // ===== Combo =====
  { code: "0016", name_en: "Mixed Grill Oval Tray (10 Persons) (Mashawi Mishkal)", price: 500, unit: "10 Persons", category: "combo" },
  { code: "0016-2", name_en: "Mixed Grill Oval Tray (15 Persons) (Mashawi Mishkal)", price: 750, unit: "15 Persons", category: "combo" },
  { code: "0016-3", name_en: "Mixed Grill Oval Tray (20 Persons) (Mashawi Mishkal)", price: 1000, unit: "20 Persons", category: "combo" },
  { code: "0017", name_en: "Mixed Grill Round Tray (5 Persons) (Mashawi Mishkal)", price: 260, unit: "5 Persons", category: "combo" },

  // ===== Appetizer =====
  { code: "0028", name_en: "Hummus (Large Plate) (Hummus)", price: 9, unit: "One Plate", category: "appetizer" },
  { code: "0029", name_en: "Mahyawa Bread (3 breads) (Khubz Mahyawa)", price: 15, unit: "3 Breads", category: "appetizer" },
  { code: "0030", name_en: "Shirazi Salad (Salad Shirazi)", price: 8, unit: "One Plate", category: "appetizer" },
  { code: "0031", name_en: "Halwa (Halwa)", price: 8, unit: "300g", category: "appetizer" },
  { code: "0032", name_en: "Yogurt and Cucumber", price: 8, unit: "One Plate", category: "appetizer" },
  { code: "0033", name_en: "Garlic Yogurt", price: 8, unit: "One Plate", category: "appetizer" },
  { code: "0044", name_en: "Tandoor Bread Irani (Khubz Tandoor)", price: 1, unit: "150g", category: "appetizer" },
  { code: "0045", name_en: "Cheese Bread (Side)", price: 5, unit: "-", category: "appetizer" },
  { code: "0046", name_en: "Mahyawa Bread (Side) (Khubz Mahyawa)", price: 3, unit: "-", category: "appetizer" },
  { code: "0047", name_en: "Rocca Salad (Salad Jarjeer)", price: 5, unit: "100g", category: "appetizer" },
  { code: "0048", name_en: "Yogurt (Laban)", price: 5, unit: "500g", category: "appetizer" },
  { code: "0049", name_en: "Hummus (Side) (Hummus)", price: 8, unit: "-", category: "appetizer" },
  { code: "0050", name_en: "Shirazi Salad (300g) (Salad Shirazi)", price: 8, unit: "300g", category: "appetizer" },
  { code: "0051", name_en: "Yogurt and Cucumber (500g)", price: 8, unit: "500g", category: "appetizer" },
  { code: "0052", name_en: "Garlic Yogurt (500g)", price: 8, unit: "500g", category: "appetizer" },
  { code: "0059", name_en: "Side Dish", price: 7, unit: "-", category: "appetizer" },
  { code: "0060", name_en: "Salad", price: 5, unit: "-", category: "appetizer" },
  { code: "0061", name_en: "Irani Bread (1pc) (Khubz Irani)", price: 1, unit: "1pc", category: "appetizer" },
  { code: "0062", name_en: "French Fries", price: 10, unit: "-", category: "appetizer" },

  // ===== Drinks =====
  { code: "0053", name_en: "Hot Tea (Chai)", price: 3, unit: "-", category: "drinks" },
  { code: "0054", name_en: "Pepsi (330ml)", price: 3, unit: "330ml", category: "drinks" },
  { code: "0055", name_en: "7up (330ml)", price: 3, unit: "330ml", category: "drinks" },
  { code: "0056", name_en: "Mountain Dew (330ml)", price: 3, unit: "330ml", category: "drinks" },
  { code: "0057", name_en: "Laban (300ml) (Laban)", price: 2, unit: "300ml", category: "drinks" },
  { code: "0058", name_en: "Mineral Water (500ml)", price: 2, unit: "500ml", category: "drinks" }
];

const updateMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iranian-restaurant');
    console.log('Connected to DB. Updating menu items...');
    
    for (const item of menuData) {
      await Dish.updateOne(
        { code: item.code },
        { $set: { 
            "name.en": item.name_en, 
            price: item.price, 
            unit: item.unit, 
            category: item.category 
          } 
        },
        { upsert: true }
      );
      console.log(`Updated: ${item.code} - ${item.name_en}`);
    }
    
    console.log('✅ All 78 menu items updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating menu:', error);
    process.exit(1);
  }
};

updateMenu();
