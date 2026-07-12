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
        // تم روشن: سفید + سبز
        primary: {
          light: '#16a34a',   // سبز اصلی
          DEFAULT: '#15803d',
          dark: '#166534',
        },
        // تم تیره: مشکی متالیک + سرمه‌ای
        surface: {
          dark: '#0f172a',    // سرمه‌ای تیره
          metal: '#1e293b',   // مشکی متالیک
        },
      },
      fontFamily: {
        fa: ['Vazirmatn', 'sans-serif'],
        ar: ['Cairo', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}