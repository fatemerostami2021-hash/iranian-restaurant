import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  // ===== سوالات متداول واقعی رستوران =====
  const faqs = [
    {
      q: 'آیا غذاها کاملاً حلال هستند؟',
      a: 'بله، تمام غذاهای ما با رعایت کامل اصول حلال و با گوشت‌های باکیفیت تهیه می‌شوند. ما به سلامت و اعتقادات مشتریان خود احترام می‌گذاریم.'
    },
    {
      q: 'آیا امکان سفارش اینترنتی و تحویل در محل وجود دارد؟',
      a: 'بله، شما می‌توانید از طریق وب‌سایت، اپلیکیشن‌های سفارش غذا یا تماس تلفنی سفارش خود را ثبت کنید. تحویل در محل نیز با رعایت پروتکل‌های بهداشتی انجام می‌شود.'
    },
    {
      q: 'آیا منوی رستوران برای کودکان و رژیم‌های خاص مناسب است؟',
      a: 'ما منوی مخصوص کودکان و گزینه‌های گیاهی و رژیمی را نیز ارائه می‌دهیم. لطفاً هنگام سفارش، نیازهای خاص خود را به کارشناسان ما اطلاع دهید.'
    },
    {
      q: 'آیا رستوران فضای خصوصی برای جشن‌ها و دورهمی‌ها دارد؟',
      a: 'بله، ما سالن‌های خصوصی و نیمه‌خصوصی با ظرفیت‌های مختلف برای برگزاری جشن‌های خانوادگی، دورهمی‌های دوستانه و رویدادهای کاری داریم.'
    },
    {
      q: 'ساعت کاری رستوران چگونه است؟',
      a: 'رستوران همه روزه از ساعت8 صبح تا 2 شب باز است. در ایام تعطیلات و مناسبت‌های خاص، ساعت کاری ممکن است تغییر کند که از طریق شبکه‌های اجتماعی اعلام می‌شود.'
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A]">
      {/* ===== افکت شیشه‌ای پس‌زمینه ===== */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#D32F2F]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 mb-4">
            <FiHelpCircle className="text-[#FFD700] text-sm" />
            <span className="text-[#FFD700] text-xs font-medium tracking-wider uppercase">
              {t('homePage.faq.subtitle') || 'پاسخ به سوالات شما'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
            {t('homePage.faq.title') || 'سوالات متداول'}
          </h2>
          <p className="text-gray-400 text-base md:text-lg mt-4 max-w-2xl mx-auto font-light">
            {t('homePage.faq.description') || 'پاسخ سوالات رایج درباره رستوران، منو و خدمات ما را اینجا پیدا کنید.'}
          </p>
        </motion.div>

        {/* ===== لیست سوالات ===== */}
        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => {
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
                  ${isOpen 
                    ? 'bg-white/15 border border-white/20 shadow-2xl shadow-[#FFD700]/5' 
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                  }
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
                    ${isOpen ? 'text-[#FFD700]' : 'text-white'}
                  `}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${isOpen 
                        ? 'bg-[#FFD700] text-[#1A1A1A]' 
                        : 'bg-white/10 text-white'
                      }
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
                      <div className="px-6 pb-6 pt-2 border-t border-white/10">
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
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
