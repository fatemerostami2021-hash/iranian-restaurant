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
        // ===== رنگ‌های اصلی =====
        primary: {
          DEFAULT: '#D32F2F',      // قرمز اصلی
          dark: '#B71C1C',         // قرمز تیره
          light: '#F44336',        // قرمز روشن
          golden: '#FFD700',       // طلایی
          goldenDark: '#F9A825',   // طلایی تیره
          goldenLight: '#FFEB3B',  // طلایی روشن
        },
        // ===== رنگ‌های پس‌زمینه =====
        background: {
          light: '#FFF8F0',        // کرم روشن (تم لایت)
          dark: '#1C1C1C',         // مشکی ذغالی (تم تاریک)
          card: '#FFFFFF',         // سفید کارت‌ها
        },
        surface: {
          light: '#F5EDE0',        // سطح کرم (تم لایت)
          dark: '#1C1C1C',         // سطح تیره (تم تاریک)
          metal: '#3E2723',        // قهوه‌ای تیره
          card: '#FFFFFF',         // کارت‌ها
        },
        // ===== رنگ‌های متن =====
        text: {
          light: '#1A1A1A',        // مشکی (تم لایت)
          dark: '#F7F0E6',         // کرم روشن (تم تاریک)
          muted: '#666666',        // خاکستری
        },
      },
      fontFamily: {
        fa: ['Vazirmatn', 'system-ui', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
        ar: ['Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 45%, #FFD700 100%)',
      },
    },
  },
  plugins: [],
}
