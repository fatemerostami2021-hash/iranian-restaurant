import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { dessertsArticleContent } from '../../data/dessertsArticleContent';

const labels = {
  en: { tag: 'Read the story', cta: 'Read the article' },
  fa: { tag: 'داستان را بخوانید', cta: 'مقاله را بخوانید' },
  ar: { tag: 'اقرأ القصة', cta: 'اقرأ المقال' },
};

// ✅ تابع کمکی برای استخراج امن متن (حتی اگر متن یک آبجکت باشد)
function getSafeText(val, lang) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val[lang] || val.en || '';
  return '';
}

export default function DessertArticleCard({ lang = 'en', isDark = false }) {
  const supported = ['en', 'fa', 'ar'];
  const l = supported.includes(lang) ? lang : 'en';
  const isRtl = l === 'fa' || l === 'ar';

  const content = dessertsArticleContent[l] || dessertsArticleContent.en;
  
  // ✅ استخراج امن تیتر و زیرتیتر با استفاده از تابع کمکی
  const heroTitle = getSafeText(content.hero?.title, l) || getSafeText(content.meta?.title, l) || 'Persian Ice Cream';
  const heroSubtitle = getSafeText(content.hero?.subtitle, l) || getSafeText(content.meta?.description, l) || 'Bastani & Faloodeh';

  const label = labels[l] || labels.en;
  const bg = isDark ? 'bg-[#2D2D2D] border-[#FFD700]/30' : 'bg-white border-[#D32F2F]/20';
  const titleClass = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const muted = isDark ? 'text-gray-400' : 'text-[#666666]';

  const articlePath = content.meta?.path || '/articles/best-ice-cream-qatar-bastani-faloodeh';

  return (
    <Link
      to={articlePath}
      className={`block rounded-2xl border ${bg} p-5 mb-6 transition-transform hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
          <FiBookOpen className={titleClass} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${titleClass}`}>{label.tag}</p>
          {/* ✅ حالا این‌ها ۱۰۰٪ رشته (String) هستند */}
          <p className="font-bold text-base truncate">{heroTitle}</p>
          <p className={`text-sm ${muted} line-clamp-2`}>{heroSubtitle}</p>
        </div>
        <FiArrowRight className={`flex-shrink-0 ${titleClass} ${isRtl ? 'rotate-180' : ''}`} size={20} />
      </div>
    </Link>
  );
}