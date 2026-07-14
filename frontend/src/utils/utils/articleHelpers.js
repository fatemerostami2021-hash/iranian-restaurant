// تبدیل تاریخ به فرمت فارسی/انگلیسی/عربی
export function formatDate(date, lang = 'fa') {
  if (!date) return '';
  
  const d = new Date(date);
  if (lang === 'fa') {
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else if (lang === 'ar') {
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// تبدیل دقیقه به زمان خواندن
export function getReadTime(minutes, lang = 'fa') {
  if (!minutes) return lang === 'fa' ? '۵ دقیقه' : '5 min';
  
  if (lang === 'fa') {
    return `${minutes} دقیقه`;
  } else if (lang === 'ar') {
    return `${minutes} دقيقة`;
  } else {
    return `${minutes} min`;
  }
}

// خلاصه‌سازی متن
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// تولید slug از عنوان
export function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// دسته‌بندی‌های مقالات
export const articleCategories = {
  fa: [
    { key: 'all', label: 'همه' },
    { key: 'food-stories', label: 'داستان‌های غذا' },
    { key: 'history', label: 'تاریخ و تمدن' },
    { key: 'culture', label: 'فرهنگ و آداب' },
    { key: 'city-stories', label: 'داستان شهرها' },
    { key: 'fun-facts', label: 'سرگرمی و دانستنی‌ها' }
  ],
  en: [
    { key: 'all', label: 'All' },
    { key: 'food-stories', label: 'Food Stories' },
    { key: 'history', label: 'History' },
    { key: 'culture', label: 'Culture' },
    { key: 'city-stories', label: 'City Stories' },
    { key: 'fun-facts', label: 'Fun Facts' }
  ],
  ar: [
    { key: 'all', label: 'الكل' },
    { key: 'food-stories', label: 'قصص الطعام' },
    { key: 'history', label: 'التاريخ' },
    { key: 'culture', label: 'الثقافة' },
    { key: 'city-stories', label: 'قصص المدن' },
    { key: 'fun-facts', label: 'حقائق ممتعة' }
  ]
};
