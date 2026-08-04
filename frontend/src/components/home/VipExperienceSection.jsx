import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdOutlineTableRestaurant, MdOutlineRoomService, MdOutlineLocalFireDepartment, MdOutlineGroups, MdStar } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import TypewriterText from '../ui/TypewriterText';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function VipExperienceSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ===== رنگ‌ها بر اساس تم =====
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBorder = isDark ? 'border-[#FFD700]/40' : 'border-[#D32F2F]/30';
  const btnClass = isDark ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]';
  
  // ===== متن‌ها بر اساس تم =====
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-200' : 'text-[#4A4A4A]';
  const featureTextColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  
  // ===== سایه بر اساس تم =====
  const textShadow = isDark 
    ? '0 0 25px rgba(255,215,0,0.5)' 
    : '0 0 25px rgba(211,47,47,0.25)';
  
  // ===== کارت‌ها بر اساس تم =====
  const cardBg = isDark 
    ? 'bg-white/5 backdrop-blur-xl hover:bg-white/10' 
    : 'bg-white/80 backdrop-blur-xl hover:bg-white/95';

  // ===== لایه‌های روی تصویر بر اساس تم =====
  const overlayGradient = isDark
    ? 'bg-gradient-to-t from-black via-black/85 to-black/60'
    : 'bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]/80 to-[#FFF8F0]/50';
  
  const overlaySide = isDark
    ? 'bg-gradient-to-r from-black/40 via-transparent to-black/40'
    : 'bg-gradient-to-r from-[#FFF8F0]/40 via-transparent to-[#FFF8F0]/40';

  const features = [
    { icon: MdOutlineTableRestaurant, key: 'privateRoom' },
    { icon: MdOutlineRoomService, key: 'personalService' },
    { icon: MdOutlineLocalFireDepartment, key: 'liveGrill' },
    { icon: MdOutlineGroups, key: 'groupEvents' },
  ];

  return (
    <section className="relative py-16 sm:py-24 md:py-36 overflow-hidden">
      {/* ===== پس‌زمینه تصویر (در هر دو تم) ===== */}
      <div className="absolute inset-0">
        <img
          src="/images/home/home-vip.jpg"
          alt="VIP Dining Experience"
          className={`w-full h-full object-cover scale-105 transition-opacity duration-500 ${
            isDark ? 'opacity-100' : 'opacity-30'
          }`}
          loading="lazy"
        />
        
        {/* لایه‌های روی تصویر بر اساس تم */}
        <div className={`absolute inset-0 ${overlayGradient}`}></div>
        <div className={`absolute inset-0 ${overlaySide}`}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeUp} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Eyebrow برجسته با بج ستاره‌دار */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-7">
            <MdStar className={`${accentText} text-lg sm:text-xl`} />
            <span 
              className={`text-lg sm:text-2xl md:text-3xl font-black tracking-[0.12em] sm:tracking-[0.25em] uppercase ${accentText}`}
              style={{ textShadow: textShadow }}
            >
              {t('homePage.vip.eyebrow', 'تجربه‌ای فراتر از یک شام')}
            </span>
            <MdStar className={`${accentText} text-lg sm:text-xl`} />
          </div>

          <h2 className={`text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-black ${titleColor} mb-4 sm:mb-6 leading-tight tracking-tight px-2`}>
            <TypewriterText
              as="span"
              text={t('homePage.vip.title', 'میز VIP برای لحظات خاص شما')}
              speed={30}
            />
          </h2>

          <p className={`text-sm sm:text-base md:text-xl font-bold ${subtitleColor} max-w-2xl mx-auto leading-relaxed px-2`}>
            {t('homePage.vip.subtitle', 'یک فضای خصوصی و اختصاصی برای مهمانی‌های خانوادگی، جلسات کاری یا مناسبت‌های ویژه با سرویس شخصی و منوی سفارشی.')}
          </p>
        </motion.div>

        {/* ===== ویژگی‌ها ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-14">
          {features.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              variants={fadeUp} 
              custom={i} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className={`group p-4 sm:p-5 md:p-7 rounded-2xl sm:rounded-3xl border ${accentBorder} ${cardBg} text-center transition-all duration-500 hover:-translate-y-1 shadow-lg`}
            >
              <Icon size={22} className={`sm:hidden mx-auto mb-2 ${accentText}`} />
              <Icon size={34} className={`hidden sm:block mx-auto mb-3 transition-transform duration-500 group-hover:scale-110 ${accentText}`} />
              <p className={`text-xs sm:text-sm md:text-base font-black ${featureTextColor} leading-snug`}>
                {t(`homePage.vip.features.${key}`, key)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===== دکمه CTA ===== */}
        <motion.div
          variants={fadeUp} 
          custom={4} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 ${btnClass} font-black text-sm sm:text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-2xl shadow-${isDark ? '[#FFD700]/30' : '[#D32F2F]/30'}`}
          >
            {t('homePage.vip.cta', 'رزرو میز VIP')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}