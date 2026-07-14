// دریافت متن بر اساس زبان
export function getLocalizedContent(item, lang, fallback = 'fa') {
  if (!item) return '';
  return item?.[lang] || item?.[fallback] || '';
}

// تبدیل تاریخ به فرمت زبان
export function formatDate(date, lang = 'fa') {
  if (!date) return '';
  const d = new Date(date);
  const locales = {
    fa: 'fa-IR',
    en: 'en-US',
    ar: 'ar-SA'
  };
  return d.toLocaleDateString(locales[lang] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// زمان مطالعه
export function getReadTime(minutes, lang = 'fa') {
  if (!minutes) return lang === 'fa' ? '۵ دقیقه' : '5 min';
  const labels = {
    fa: 'دقیقه',
    en: 'min',
    ar: 'دقيقة'
  };
  return `${minutes} ${labels[lang] || 'min'}`;
}

// خلاصه‌سازی متن
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
