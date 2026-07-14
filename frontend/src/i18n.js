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
      en: { translation: en },
      fa: { translation: fa },
      ar: { translation: ar },
    },
    fallbackLng: 'fa',
    supportedLngs: ['en', 'fa', 'ar'],
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

applyDirection(i18n.resolvedLanguage || i18n.language || 'fa');

i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
});

export default i18n;
