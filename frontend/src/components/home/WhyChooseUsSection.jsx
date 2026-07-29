import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MdOutlineEco, MdOutlineHistoryEdu, MdOutlineEmojiEvents, MdOutlineDeliveryDining } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import TypewriterText from '../ui/TypewriterText';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const fadeSide = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export default function WhyChooseUsSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const cardClass = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBorder = isDark ? 'border-[#FFD700]' : 'border-[#D32F2F]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const gradientText = isDark
    ? 'bg-gradient-to-r from-white via-[#FFD700] to-white bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-[#1A1A1A] via-[#D32F2F] to-[#1A1A1A] bg-clip-text text-transparent';
  const accentGlow = isDark ? 'rgba(255, 215, 0, 0.35)' : 'rgba(211, 47, 47, 0.3)';

  const reasons = [
    { icon: MdOutlineEco, key: 'freshDaily' },
    { icon: MdOutlineHistoryEdu, key: 'traditionalRecipe' },
    { icon: MdOutlineEmojiEvents, key: 'awardWinning' },
    { icon: MdOutlineDeliveryDining, key: 'fastDelivery' },
  ];

  return (
    <section className={`relative py-11 sm:py-14 md:py-20 overflow-hidden ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div dir="ltr" className="grid md:grid-cols-2 gap-7 md:gap-11 items-center">

          {/* ستون متن */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            dir="auto"
            className="order-2 md:order-1 text-center md:text-start"
          >
            <span
              className={`inline-block text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 ${accentText}`}
              style={{ textShadow: isDark ? '0 0 25px rgba(255,215,0,0.4)' : '0 0 25px rgba(211,47,47,0.25)' }}
            >
              {t('homePage.whyUs.eyebrow', 'همیشه دنبال بهترین‌ها هستی')}
            </span>

            <h2 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 leading-tight tracking-tight ${gradientText}`}>
              <TypewriterText
                as="span"
                text={t('homePage.whyUs.title', 'چرا کباب داغ نان داغ؟')}
                speed={30}
              />
            </h2>

            <p className={`text-sm sm:text-base md:text-lg font-bold leading-relaxed mb-6 sm:mb-7 ${mutedClass}`}>
              {t('homePage.whyUs.subtitle', 'هر روز، با همان عشق روز اول، بهترین‌ها را برای شما آماده می‌کنیم.')}
            </p>

            <div className="space-y-2 sm:space-y-3">
              {reasons.map(({ icon: Icon, key }, i) => (
                <motion.div
                  key={key}
                  variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className={`group flex items-center gap-4 p-3 sm:p-3.5 rounded-2xl border text-start transition-all duration-500 hover:-translate-y-0.5 ${cardClass}`}
                >
                  <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'
                  }`}>
                    <Icon size={20} className={`sm:hidden ${accentText}`} />
                    <Icon size={23} className={`hidden sm:block ${accentText}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-sm sm:text-base md:text-lg font-black mb-0.5 tracking-tight ${textClass}`}>
                      {t(`homePage.whyUs.reasons.${key}.title`, key)}
                    </h3>
                    <p className={`text-xs sm:text-sm md:text-base font-semibold leading-relaxed ${mutedClass}`}>
                      {t(`homePage.whyUs.reasons.${key}.desc`, '')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ستون تصویر - بزرگتر با افکت ۳ بعدی هاور */}
          <motion.div
            variants={fadeSide} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="order-1 md:order-2 relative flex justify-center perspective-1000"
          >
            {/* افکت نور پس‌زمینه */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl opacity-70 scale-105"
              style={{ background: `radial-gradient(circle, ${accentGlow}, transparent 70%)` }}
            ></div>

            {/* کانتینر عکس با افکت ۳ بعدی */}
            <div 
              className="relative w-full max-w-2xl aspect-[9/7] rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-700 hover:scale-105 hover:rotate-2 hover:shadow-3xl"
              style={{ 
                borderColor: isDark ? '#FFD700' : '#D32F2F',
                transformStyle: 'preserve-3d',
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* عکس */}
              <img
                src="/images/home/why-kababdagh.jpg"
                alt={t('homePage.whyUs.title', 'چرا کباب داغ نان داغ؟')}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
              
              {/* لایه‌ی گرادینت روی عکس */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* برچسب طلایی روی عکس */}
              <div className="absolute bottom-6 right-6 left-6">
                <div className={`inline-block px-4 py-2 rounded-full ${isDark ? 'bg-[#FFD700]/20 backdrop-blur-sm border border-[#FFD700]/30' : 'bg-white/20 backdrop-blur-sm border border-white/30'}`}>
                  <span className={`text-sm font-bold ${isDark ? 'text-[#FFD700]' : 'text-white'}`}>
                    ⭐ {t('homePage.whyUs.badge', 'انتخاب اول شما')}
                  </span>
                </div>
              </div>

              {/* افکت شیشه‌ای روی عکس هنگام هاور */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}