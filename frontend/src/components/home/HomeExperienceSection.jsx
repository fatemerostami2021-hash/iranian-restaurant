import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPhone, FiCalendar } from 'react-icons/fi';
import {
  MdOutlineEco, MdOutlineHistoryEdu, MdOutlineEmojiEvents, MdOutlineDeliveryDining,
  MdOutlineTableRestaurant, MdOutlineRoomService, MdOutlineLocalFireDepartment, MdOutlineGroups,
} from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import TypewriterText from '../ui/TypewriterText';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const DELIVERY_APPS = [
  { id: 'snoonu', name: { fa: 'اسنونو', en: 'Snoonu', ar: 'سنونو' }, url: 'https://snoonu.com/restaurants/kabab-dagh-nan-dagh-restaurant', color: '#e2231a' },
  { id: 'talabat', name: { fa: 'طلبات', en: 'Talabat', ar: 'طلبات' }, url: 'https://www.talabat.com/qatar/kabab-dagh-reasturant', color: '#ff5a00' },
  { id: 'keeta', name: { fa: 'کیتا', en: 'Keeta', ar: 'كيتا' }, url: 'https://courier.keeta-global.com/', color: '#ffcc00' },
];

const REASONS = [
  { icon: MdOutlineEco, key: 'freshDaily' },
  { icon: MdOutlineHistoryEdu, key: 'traditionalRecipe' },
  { icon: MdOutlineEmojiEvents, key: 'awardWinning' },
  { icon: MdOutlineDeliveryDining, key: 'fastDelivery' },
];

const VIP_FEATURES = [
  { icon: MdOutlineTableRestaurant, key: 'privateRoom' },
  { icon: MdOutlineRoomService, key: 'personalService' },
  { icon: MdOutlineLocalFireDepartment, key: 'liveGrill' },
  { icon: MdOutlineGroups, key: 'groupEvents' },
];

/** جداکننده‌ی «سیخ کباب» */
function SkewerDivider({ accent }) {
  return (
    <div className="flex items-center gap-2 my-6 sm:my-8" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent}55)` }} />
      <svg width="72" height="10" viewBox="0 0 72 10" className="shrink-0">
        <line x1="4" y1="5" x2="68" y2="5" stroke={accent} strokeWidth="1.5" />
        {[10, 22, 34, 46, 58].map((x) => (
          <circle key={x} cx={x} cy="5" r="3" fill={accent} opacity="0.85" />
        ))}
      </svg>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent}55)` }} />
    </div>
  );
}

export default function HomeExperienceSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language.split('-')[0] || 'en';

  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const accent = isDark ? '#FFD700' : '#D32F2F';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  
  // ✅ کارت‌های شیشه‌ای با شفافیت و سایه بیشتر
  const glassCard = isDark 
    ? 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl' 
    : 'bg-white/80 backdrop-blur-2xl border border-gray-200 shadow-2xl';
    
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const btnClass = isDark ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]';
  const gradientText = isDark
    ? 'bg-gradient-to-r from-white via-[#FFD700] to-white bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-[#1A1A1A] via-[#D32F2F] to-[#1A1A1A] bg-clip-text text-transparent';

  const getLocalizedName = (item) => item.name[currentLang] || item.name.fa || item.name.en || '';

  return (
    <section 
      className={`relative py-12 sm:py-16 md:py-20 overflow-hidden ${bgClass}`}
      aria-label={t('homePage.whyUs.title', 'چرا کباب داغ نان داغ؟')}
      itemScope 
      itemType="https://schema.org/Restaurant"
    >
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor::after {
          content: '|';
          display: inline-block;
          margin-right: 2px;
          animation: blink-cursor 0.8s infinite;
          font-weight: 100;
          color: ${accent};
        }
        .typing-glow {
          text-shadow: 0 0 20px ${isDark ? 'rgba(255,215,0,0.3)' : 'rgba(211,47,47,0.25)'};
        }
      `}</style>

      <meta itemProp="name" content={t('restaurant.name')} />
      <meta itemProp="address" content={t('contact.info.address', 'دوحه، قطر')} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* ✅ گرید 12 ستونی برای پر کردن کل عرض */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

          {/* ── ستون چپ: چرا کباب داغ ── */}
          <motion.article
            variants={fadeUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }}
            className={`md:col-span-3 lg:col-span-3 p-6 sm:p-8 md:p-10 rounded-3xl ${glassCard} flex flex-col justify-center text-center md:text-start order-1`}
          >
            <span className={`inline-block text-xs sm:text-sm font-black mb-3 tracking-wide uppercase ${accentText}`}>
              {t('homePage.whyUs.eyebrow', 'همیشه دنبال بهترین‌ها هستی')}
            </span>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight typing-glow ${gradientText}`}>
              <TypewriterText 
                as="span" 
                text={t('homePage.whyUs.title', 'چرا کباب داغ نان داغ؟')} 
                speed={35} 
                className="typing-cursor"
              />
            </h2>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
              {REASONS.map(({ icon: Icon, key }, i) => (
                <motion.div
                  key={key}
                  variants={fadeUp} 
                  custom={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors duration-300 ${
                    isDark ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  <Icon size={14} className={accentText} />
                  {t(`homePage.whyUs.reasons.${key}.title`, key)}
                </motion.div>
              ))}
            </div>

            <p className={`text-sm md:text-base font-medium ${mutedClass} leading-relaxed`}>
              {t('homePage.whyUs.subtitle', 'هر روز، با همان عشق روز اول، بهترین‌ها را برای شما آماده می‌کنیم.')}
            </p>
          </motion.article>

          {/* ── ستون وسط: عکس بزرگ ── */}
          <motion.figure
            variants={fadeUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }}
            className="md:col-span-6 lg:col-span-6 order-2 relative flex justify-center items-center"
          >
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-50 scale-105"
              style={{ background: `radial-gradient(circle, ${isDark ? 'rgba(255,215,0,0.25)' : 'rgba(211,47,47,0.2)'}, transparent 70%)` }}
            />
            {/* ✅ عکس با عرض کامل و ارتفاع بیشتر */}
            <div
              className="relative w-full max-w-lg lg:max-w-xl aspect-[4/3] md:aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden border-4 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              style={{ borderColor: accent }}
            >
              <img
                src="/images/hero/picture/hero1.webp"
                alt={t('homePage.vip.imageAlt', 'رستوران کباب داغ نان داغ')}
                className="w-full h-full object-cover"
                loading="lazy"
                itemProp="image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 right-6 left-6">
                <div className={`inline-block px-4 py-2 rounded-full ${isDark ? 'bg-[#FFD700]/20 backdrop-blur-sm border border-[#FFD700]/30' : 'bg-white/25 backdrop-blur-sm border border-white/30'}`}>
                  <span className={`text-sm font-bold ${isDark ? 'text-[#FFD700]' : 'text-white'}`}>
                    ⭐ {t('homePage.whyUs.badge', 'انتخاب اول شما')}
                  </span>
                </div>
              </figcaption>
            </div>
          </motion.figure>

          {/* ── ستون راست: VIP ── */}
          <motion.article
            variants={fadeUp} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }}
            className={`md:col-span-3 lg:col-span-3 p-6 sm:p-8 md:p-10 rounded-3xl ${glassCard} flex flex-col justify-center text-center md:text-start order-3`}
          >
            <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4 ${gradientText}`}>
              {t('homePage.vip.title', 'میز VIP برای لحظات خاص شما')}
            </h3>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {VIP_FEATURES.map(({ icon: Icon, key }, i) => (
                <motion.div
                  key={key}
                  variants={fadeUp} 
                  custom={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${
                    isDark ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  <Icon size={14} className={accentText} />
                  {t(`homePage.vip.features.${key}`, key)}
                </motion.div>
              ))}
            </div>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-6 py-3 ${btnClass} font-black text-sm rounded-full transition-all duration-300 hover:scale-105 shadow-xl w-fit mx-auto md:mx-0`}
            >
              {t('homePage.vip.cta', 'رزرو میز VIP')}
            </Link>
          </motion.article>

        </div>

        <SkewerDivider accent={accent} />

        {/* ===== ردیف پایین ===== */}
        <motion.nav
          variants={fadeUp} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <a
              href="tel:+97433000157"
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg ${
                isDark ? 'bg-[#FFD700] text-black hover:bg-[#F9A825]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]'
              }`}
            >
              <FiPhone size={18} />
              {t('homePage.reservation.phone', 'تماس برای رزرو')}
            </a>

            <Link
              to="/contact"
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg border-2 ${
                isDark ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'
              }`}
            >
              <FiCalendar size={18} />
              {t('homePage.reservation.cta', 'رزرو آنلاین')}
            </Link>

            {DELIVERY_APPS.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm md:text-base text-white transition-all duration-300 hover:scale-105 shadow-lg"
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
        </motion.nav>

      </div>
    </section>
  );
}