import { useTranslation } from 'react-i18next';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const DELIVERY_APPS = [
  { id: 'snoonu', name: { fa: 'اسنونو', en: 'Snoonu', ar: 'سنونو' }, url: 'https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant', color: '#e2231a' },
  { id: 'talabat', name: { fa: 'طلبات', en: 'Talabat', ar: 'طلبات' }, url: 'https://www.talabat.com/qatar/kabab-dagh-reasturant', color: '#ff5a00' },
  { id: 'keeta', name: { fa: 'کیتا', en: 'Keeta', ar: 'كيتا' }, url: 'https://courier.keeta-global.com/', color: '#ffcc00' },
];

export default function ReservationBar() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;

  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-[#666666]';

  const getLocalizedName = (item) => item.name[currentLang] || item.name.fa || item.name.en || '';

  return (
    <section className={`py-8 md:py-10 px-4 text-center ${bgClass}`}>
      <h2 className={`text-xl md:text-2xl font-black mb-2 ${titleColor}`}>
        {t('homePage.reservation.title', 'رزرو میز')}
      </h2>
      <p className={`text-sm mb-6 ${subtitleColor}`}>
        {t('homePage.reservation.subtitle', 'برای تجربه‌ای بی‌نظیر، همین حالا میز خود را رزرو کنید')}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <a
          href="tel:+97433000157"
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            isDark ? 'bg-[#FFD700] text-black hover:bg-[#F9A825]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]'
          }`}
        >
          <FiPhone size={16} />
          {t('homePage.reservation.phone', 'تماس')}
        </a>

        <a
          href="/contact"
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
            isDark ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'
          }`}
        >
          <FiCalendar size={16} />
          {t('homePage.reservation.cta', 'رزرو')}
        </a>

        {DELIVERY_APPS.map((app) => (
          <a
            key={app.id}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: app.color, boxShadow: `0 4px 14px ${app.color}40` }}
          >
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              {app.name.en?.charAt(0) || 'D'}
            </span>
            {getLocalizedName(app)}
          </a>
        ))}
      </div>
    </section>
  );
}