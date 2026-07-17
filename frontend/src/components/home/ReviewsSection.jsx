import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function ReviewsSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const reviews = [1, 2, 3].map((n) => ({
    name: t(`homePage.reviews.r${n}name`),
    text: t(`homePage.reviews.r${n}text`),
  }));

  // ===== کلاس‌های پویا بر اساس تم =====
  const titleColor = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const cardBg = isDark ? 'bg-[#2D2D2D]/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-[#FFD700]/10' : 'border-[#D32F2F]/10';
  const textColor = isDark ? 'text-gray-300' : 'text-[#1A1A1A]';
  const nameColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const shadowColor = isDark ? 'shadow-[#FFD700]/5' : 'shadow-[#D32F2F]/5';
  const quoteColor = isDark ? 'text-[#FFD700]/20' : 'text-[#D32F2F]/20';

  // ===== ستاره‌های طلایی =====
  const starColor = '#FFD700';
  const starBg = isDark ? 'bg-[#FFD700]/10' : 'bg-[#FFD700]/10';

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* ===== افکت‌های پس‌زمینه ===== */}
      <div className="absolute inset-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[40%] h-[40%] ${isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/5'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] ${isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/5'} rounded-full blur-3xl`} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* ===== هدر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/10 mb-4">
            <span className="text-[#FFD700] text-xs font-medium tracking-wider uppercase">
              {t('homePage.reviews.badge') || 'نظرات'}
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black ${titleColor} tracking-tight leading-[1.1] transition-colors duration-300`}>
            {t('homePage.reviews.title')}
          </h2>
          <p className={`${subtitleColor} text-base md:text-lg mt-4 max-w-2xl mx-auto font-light transition-colors duration-300`}>
            {t('homePage.reviews.subtitle')}
          </p>
        </motion.div>

        {/* ===== کارت‌های نظرات ===== */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative ${cardBg} backdrop-blur-sm rounded-3xl p-6 md:p-8 border ${cardBorder} shadow-xl ${shadowColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group`}
            >
              {/* ===== نقل قول ===== */}
              <div className={`absolute top-4 right-6 text-6xl ${quoteColor} font-serif select-none`}>
                &ldquo;
              </div>

              {/* ===== ستاره‌ها ===== */}
              <div className={`flex gap-1 mb-4 ${starBg} rounded-full px-3 py-1.5 w-fit`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar
                    key={s}
                    size={16}
                    className="text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_4px_rgba(255,215,0,0.3)]"
                  />
                ))}
              </div>

              {/* ===== متن نظر ===== */}
              <p className={`text-sm md:text-base ${textColor} mb-5 leading-relaxed line-clamp-4 transition-colors duration-300`}>
                &ldquo;{r.text}&rdquo;
              </p>

              {/* ===== نام ===== */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#F9A825] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#FFD700]/20">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <span className={`font-bold text-sm ${nameColor} transition-colors duration-300`}>
                    {r.name}
                  </span>
                  <p className="text-[10px] text-gray-400 font-light tracking-wider uppercase">
                    {t('homePage.reviews.customer') || 'مشتری'}
                  </p>
                </div>
              </div>

              {/* ===== افکت هاور ===== */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFD700]/0 via-[#FFD700]/0 to-[#FFD700]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* ===== آمار کلی ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-8 border-t border-white/5"
        >
          <div className="text-center">
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>4.8</p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.avgRating') || 'میانگین امتیاز'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>127</p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.totalReviews') || 'تعداد نظرات'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>۹۸٪</p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.satisfaction') || 'رضایت مشتریان'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
