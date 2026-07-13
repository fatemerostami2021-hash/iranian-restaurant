import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // ===== رستوران =====
      restaurant: { name: "Kabab Dagh Nan Dagh" },
      
      // ===== ناوبری =====
      nav: {
        home: "Home",
        menu: "Menu",
        articles: "Articles",
        about: "About",
        contact: "Contact",
        cart: "Cart"
      },
      
      // ===== قهرمان =====
      hero: {
        title: "Authentic Iranian Cuisine",
        subtitle: "Traditional flavors, crafted with love, served in Doha",
        cta: "Explore Menu"
      },
      
      // ===== دسته‌بندی‌های مگامنو (کلیدهای ساده) =====
      breakfast: "Breakfast",
      main: "Main Dishes",
      combo: "Combo Trays",
      appetizer: "Appetizers",
      drinks: "Drinks",
      view_all: "View All",
      
      // ===== آیتم‌های مگامنو =====
      baja_dag: "Baja Dag",
      ash_sabzi: "Ash Sabzi",
      cheese_bread: "Cheese Bread",
      foul: "Foul",
      liver: "Liver",
      mix_tikka: "Mix Tikka",
      kofta: "Kofta",
      chicken_saffron: "Chicken Saffron",
      lamb_chops: "Lamb Chops",
      kabab_barg: "Kabab Barg",
      tray_5: "Tray 5 Persons",
      tray_10: "Tray 10 Persons",
      tray_15: "Tray 15 Persons",
      tray_20: "Tray 20 Persons",
      salad_shirazi: "Shirazi Salad",
      yogurt_cucumber: "Yogurt & Cucumber",
      hummus: "Hummus",
      tandoor_bread: "Tandoor Bread",
      french_fries: "French Fries",
      tea: "Tea",
      soda: "Soda",
      doogh: "Doogh",
      water: "Water",
      leben: "Leben",
      
      // ===== منو =====
      menu: {
        title: "Our Menu",
        categories: {
          all: "All",
          kabab: "Kabab",
          appetizer: "Appetizers",
          stew: "Stews",
          dessert: "Desserts",
          drink: "Drinks"
        },
        addToCart: "Add to Cart",
        ingredients: "Ingredients",
        prepTime: "min preparation"
      },
      
      // ===== سبد خرید =====
      cart: {
        title: "Your Order",
        empty: "Your cart is empty",
        total: "Total",
        checkout: "Checkout",
        quantity: "Quantity"
      },
      
      // ===== تسویه حساب =====
      checkout: {
        name: "Full Name",
        phone: "Phone Number",
        address: "Delivery Address",
        table: "Table Number",
        notes: "Special Notes",
        submit: "Place Order"
      },
      
      // ===== فوتر =====
      footer: {
        rights: "All rights reserved",
        followUs: "Follow Us"
      }
    }
  },
  
  fa: {
    translation: {
      restaurant: { name: "کباب داغ نان داغ" },
      
      nav: {
        home: "خانه",
        menu: "منو",
        articles: "مطالب خواندنی",
        about: "درباره ما",
        contact: "تماس با ما",
        cart: "سبد سفارش"
      },
      
      hero: {
        title: "طعم اصیل ایرانی",
        subtitle: "طعم‌های سنتی، پخته‌شده با عشق، سرو در دوحه",
        cta: "مشاهده منو"
      },
      
      // ===== دسته‌بندی‌های مگامنو =====
      breakfast: "صبحانه",
      main: "غذای اصلی",
      combo: "سینی‌ها",
      appetizer: "پیش‌غذا",
      drinks: "نوشیدنی‌ها",
      view_all: "مشاهده همه",
      
      // ===== آیتم‌های مگامنو =====
      baja_dag: "باجه داغ",
      ash_sabzi: "آش سبزی",
      cheese_bread: "نان پنیری",
      foul: "فول",
      liver: "جگر",
      mix_tikka: "میکس تیکا",
      kofta: "کوفته",
      chicken_saffron: "جوجه زعفرانی",
      lamb_chops: "ریش",
      kabab_barg: "کباب برگ",
      tray_5: "سینی ۵ نفره",
      tray_10: "سینی ۱۰ نفره",
      tray_15: "سینی ۱۵ نفره",
      tray_20: "سینی ۲۰ نفره",
      salad_shirazi: "سالاد شیرازی",
      yogurt_cucumber: "ماست و خیار",
      hummus: "حمص",
      tandoor_bread: "نان تندوری",
      french_fries: "سیب‌زمینی",
      tea: "چای",
      soda: "نوشابه",
      doogh: "دوغ",
      water: "آب",
      leben: "لبن",
      
      menu: {
        title: "منوی ما",
        categories: {
          all: "همه",
          kabab: "کباب",
          appetizer: "پیش‌غذا",
          stew: "خورشت",
          dessert: "دسر",
          drink: "نوشیدنی"
        },
        addToCart: "افزودن به سبد",
        ingredients: "مواد اولیه",
        prepTime: "دقیقه زمان آماده‌سازی"
      },
      
      cart: {
        title: "سبد سفارش شما",
        empty: "سبد سفارش شما خالی است",
        total: "جمع کل",
        checkout: "ثبت سفارش",
        quantity: "تعداد"
      },
      
      checkout: {
        name: "نام و نام خانوادگی",
        phone: "شماره تماس",
        address: "آدرس تحویل",
        table: "شماره میز",
        notes: "توضیحات",
        submit: "ثبت نهایی سفارش"
      },
      
      footer: {
        rights: "تمامی حقوق محفوظ است",
        followUs: "ما را دنبال کنید"
      }
    }
  },
  
  ar: {
    translation: {
      restaurant: { name: "كباب داغ نان داغ" },
      
      nav: {
        home: "الرئيسية",
        menu: "القائمة",
        articles: "المقالات",
        about: "من نحن",
        contact: "اتصل بنا",
        cart: "السلة"
      },
      
      hero: {
        title: "المذاق الإيراني الأصيل",
        subtitle: "نكهات تقليدية، محضّرة بحب، في الدوحة",
        cta: "استكشف القائمة"
      },
      
      // ===== دسته‌بندی‌های مگامنو =====
      breakfast: "الإفطار",
      main: "الأطباق الرئيسية",
      combo: "الصواني",
      appetizer: "المقبلات",
      drinks: "المشروبات",
      view_all: "عرض الكل",
      
      // ===== آیتم‌های مگامنو =====
      baja_dag: "باجة داغ",
      ash_sabzi: "آش سبزي",
      cheese_bread: "خبز بالجبن",
      foul: "فول",
      liver: "كبدة",
      mix_tikka: "ميكس تيكا",
      kofta: "كفتة",
      chicken_saffron: "دجاج بالزعفران",
      lamb_chops: "ريش غنم",
      kabab_barg: "كباب برك",
      tray_5: "صينية ٥ أشخاص",
      tray_10: "صينية ١٠ أشخاص",
      tray_15: "صينية ١٥ شخص",
      tray_20: "صينية ٢٠ شخص",
      salad_shirazi: "سلطة شيرازي",
      yogurt_cucumber: "روب وخيار",
      hummus: "حمص",
      tandoor_bread: "خبز تندور",
      french_fries: "بطاطس مقلية",
      tea: "شاي",
      soda: "مشروب غازي",
      doogh: "دوغ",
      water: "ماء",
      leben: "لبن",
      
      menu: {
        title: "قائمتنا",
        categories: {
          all: "الكل",
          kabab: "كباب",
          appetizer: "مقبلات",
          stew: "يخنة",
          dessert: "حلويات",
          drink: "مشروبات"
        },
        addToCart: "أضف إلى السلة",
        ingredients: "المكونات",
        prepTime: "دقيقة وقت التحضير"
      },
      
      cart: {
        title: "طلبك",
        empty: "سلتك فارغة",
        total: "الإجمالي",
        checkout: "إتمام الطلب",
        quantity: "الكمية"
      },
      
      checkout: {
        name: "الاسم الكامل",
        phone: "رقم الهاتف",
        address: "عنوان التوصيل",
        table: "رقم الطاولة",
        notes: "ملاحظات خاصة",
        submit: "تأكيد الطلب"
      },
      
      footer: {
        rights: "جميع الحقوق محفوظة",
        followUs: "تابعنا"
      }
    }
  }
};

const RTL_LANGS = ['fa', 'ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fa',
    supportedLngs: ['en', 'fa', 'ar'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

const applyDirection = (lng) => {
  const dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

applyDirection(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;
