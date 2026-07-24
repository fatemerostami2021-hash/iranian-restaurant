import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ===== ایمپورت فایل‌های ترجمه =====
import en from './locales/en/translation.json';
import fa from './locales/fa/translation.json';
import ar from './locales/ar/translation.json';

const RTL_LANGS = ['fa', 'ar'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar }, // ✅ عربی اول قرار گرفت
      en: { translation: en },
      fa: { translation: fa },
    },
    fallbackLng: 'ar', // ✅ زبان پیش‌فرض عربی شد
    supportedLngs: ['ar', 'en', 'fa'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// ===== تغییر جهت بر اساس زبان =====
const applyDirection = (lng) => {
  const dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

applyDirection(i18n.resolvedLanguage || i18n.language || 'ar'); // ✅ پیش‌فرض ar

i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
});

export default i18n;