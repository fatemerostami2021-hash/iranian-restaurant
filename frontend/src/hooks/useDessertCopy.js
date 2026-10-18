import { useTranslation } from 'react-i18next';
import { dessertsContent } from '../data/dessertsContent';

// Returns the dessert copy for the active site language (en / fa / ar).
export function useDessertCopy() {
  const { i18n } = useTranslation();
  const raw = (i18n?.resolvedLanguage || i18n?.language || 'ar').slice(0, 2).toLowerCase();
  const lang = dessertsContent[raw] ? raw : 'en';
  return { lang, dir: lang === 'en' ? 'ltr' : 'rtl', copy: dessertsContent[lang] };
}
