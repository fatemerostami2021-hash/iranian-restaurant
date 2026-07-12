import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      restaurant: { name: "Kabab Dagh Nan Dagh" },
      nav: {
        home: "Home",
        menu: "Menu",
        about: "About",
        contact: "Contact",
        cart: "Cart"
      },
      hero: {
        title: "Authentic Iranian Cuisine",
        subtitle: "Traditional flavors, crafted with love, served in Doha",
        cta: "Explore Menu"
      },
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
      cart: {
        title: "Your Order",
        empty: "Your cart is empty",
        total: "Total",
        checkout: "Checkout",
        quantity: "Quantity"
      },
      checkout: {
        name: "Full Name",
        phone: "Phone Number",
        address: "Delivery Address",
        table: "Table Number",
        notes: "Special Notes",
        submit: "Place Order"
      },
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
        about: "درباره ما",
        contact: "تماس با ما",
        cart: "سبد سفارش"
      },
      hero: {
        title: "طعم اصیل ایرانی",
        subtitle: "طعم‌های سنتی، پخته‌شده با عشق، سرو در دوحه",
        cta: "مشاهده منو"
      },
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
        about: "من نحن",
        contact: "اتصل بنا",
        cart: "السلة"
      },
      hero: {
        title: "المذاق الإيراني الأصيل",
        subtitle: "نكهات تقليدية، محضّرة بحب، في الدوحة",
        cta: "استكشف القائمة"
      },
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
