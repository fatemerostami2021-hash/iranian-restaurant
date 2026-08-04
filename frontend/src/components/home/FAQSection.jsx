import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function FAQSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState(null);

  // ===== دریافت سوالات از فایل ترجمه (homePage.faq) =====
  const faqKeys = [
    { q: 'q1', a: 'a1' },
    { q: 'q2', a: 'a2' },
    { q: 'q3', a: 'a3' },
    { q: 'q4', a: 'a4' },
    { q: 'q5', a: 'a5' },
  ];

  // ===== ساخت لیست سوالات از ترجمه =====
  const faqs = faqKeys.map(({ q, a }) => ({
    q: t(`homePage.faq.${q}`, ''),
    a: t(`homePage.faq.${a}`, '')
  }));

  // ===== فیلتر کردن سوالات خالی =====
  const validFaqs = faqs.filter(f => f.q && f.q !== 'homePage.faq.q1' && f.q !== '');

  // ===== اگر سوالی وجود نداشت، چیزی نمایش نده =====
  if (validFaqs.length === 0) {
    return null;
  }

  // ===== کلاس‌های پویا بر اساس تم =====
  const bgGradient = isDark
    ? 'bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]'
    : 'bg-[#FFFBF5]';

  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const descriptionColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  
  const cardBgClosed = isDark 
    ? 'bg-white/5 border border-white/5 hover:bg-white/10' 
    : 'bg-white/80 border border-gray-200/50 hover:bg-white/95 shadow-sm';
  
  const cardBgOpen = isDark
    ? 'bg-white/15 border border-white/20 shadow-2xl shadow-[#FFD700]/5'
    : 'bg-white border border-[#D32F2F]/20 shadow-2xl shadow-[#D32F2F]/10';

  const questionColor = isDark 
    ? 'text-white hover:text-[#FFD700]' 
    : 'text-[#1A1A1A] hover:text-[#D32F2F]';
  
  const questionActiveColor = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const answerColor = isDark ? 'text-gray-300' : 'text-[#4A4A4A]';
  
  const iconBg = isDark 
    ? 'bg-white/10 text-white' 
    : 'bg-gray-100 text-[#1A1A1A]';
  
  const iconActiveBg = isDark 
    ? 'bg-[#FFD700] text-[#1A1A1A]' 
    : 'bg-[#D32F2F] text-white';
  
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200/50';
  const badgeBg = isDark 
    ? 'bg-white/10 backdrop-blur-md border border-white/10' 
    : 'bg-[#D32F2F]/10 backdrop-blur-md border border-[#D32F2F]/20';
  const badgeText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';

  // ===== افکت‌های پس‌زمینه بر اساس تم =====
  const effect1 = isDark 
    ? 'bg-[#D32F2F]/10' 
    : 'bg-[#D32F2F]/5';
  const effect2 = isDark 
    ? 'bg-[#FFD700]/10' 
    : 'bg-[#FFD700]/5';
  const effect3 = isDark 
    ? 'bg-white/5' 
    : 'bg-white/30';

  return (
    <section className={`relative py-16 md:py-24 overflow-hidden ${bgGradient} transition-colors duration-300`}>
      {/* ===== افکت شیشه‌ای پس‌زمینه ===== */}
      <div className="absolute inset-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[40%] h-[40%] ${effect1} rounded-full blur-3xl`} />
        <div className={`absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] ${effect2} rounded-full blur-3xl`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] ${effect3} rounded-full blur-3xl`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* ===== هدر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center gap-2 ${badgeBg} rounded-full px-4 py-1.5 border mb-4`}>
            <FiHelpCircle className={`${badgeText} text-sm`} />
            <span className={`${badgeText} text-xs font-medium tracking-wider uppercase`}>
              {t('homePage.faq.subtitle', 'پاسخ به سوالات شما')}
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-black ${titleColor} tracking-tight leading-[1.1] transition-colors duration-300`}>
            {t('homePage.faq.title', 'سوالات متداول')}
          </h2>
          <p className={`${descriptionColor} text-base md:text-lg mt-4 max-w-2xl mx-auto font-light transition-colors duration-300`}>
            {t('homePage.faq.description', 'پاسخ سوالات رایج درباره رستوران، منو و خدمات ما را اینجا پیدا کنید.')}
          </p>
        </motion.div>

        {/* ===== لیست سوالات ===== */}
        <div className="flex flex-col gap-4">
          {validFaqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`
                  relative rounded-2xl backdrop-blur-md transition-all duration-300
                  ${isOpen ? cardBgOpen : cardBgClosed}
                `}
              >
                {/* ===== دکمه سوال ===== */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start"
                >
                  <span className={`
                    font-semibold text-sm md:text-base transition-colors duration-300
                    ${isOpen ? questionActiveColor : questionColor}
                  `}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${isOpen ? iconActiveBg : iconBg}
                    `}
                  >
                    <FiChevronDown size={18} />
                  </motion.div>
                </button>

                {/* ===== پاسخ ===== */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 pt-2 border-t ${borderColor}`}>
                        <p className={`${answerColor} text-sm md:text-base leading-relaxed max-w-2xl transition-colors duration-300`}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}