/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ===== رنگ‌های اصلی بر اساس لوگو =====
        primary: {
          DEFAULT: '#F4B41A',      // طلایی شعله
          dark: '#E67E22',         // نارنجی تیره
          light: '#F5C842',        // طلایی روشن
          deeper: '#C62828',       // قرمز کباب
          accent: '#E53935',       // قرمز روشن
        },
        // ===== رنگ‌های مکمل =====
        secondary: {
          green: '#5E8C31',        // سبز زیتونی
          darkGreen: '#2E7D32',    // سبز تیره
        },
        // ===== رنگ‌های پس‌زمینه =====
        surface: {
          dark: '#1C1C1C',         // مشکی ذغالی
          metal: '#3E2723',        // قهوه‌ای تیره
          light: '#F7F0E6',        // کرم روشن
          card: '#FFFFFF',         // سفید کارت‌ها
        },
        // ===== رنگ‌های متن =====
        text: {
          primary: '#FFFFFF',
          secondary: '#F4B41A',
          muted: '#BDBDBD',
        },
      },
      fontFamily: {
        fa: ['Vazirmatn', 'system-ui', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
        ar: ['Cairo', 'system-ui', 'sans-serif'],
      },
      // ===== گرادیان‌ها =====
      backgroundImage: {
        'header-gradient': 'linear-gradient(135deg, #1C1C1C 0%, #3E2723 45%, #E67E22 100%)',
        'hero-gradient': 'linear-gradient(135deg, #1C1C1C 0%, #2E7D32 30%, #E67E22 100%)',
        'card-hover': 'linear-gradient(135deg, #F4B41A 0%, #E67E22 100%)',
      },
    },
  },
  plugins: [],
}
