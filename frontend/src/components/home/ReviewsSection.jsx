import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiSend, FiUser, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReviewsSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language;

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 4.8,
    totalReviews: 127,
    satisfaction: 98
  });
  const [loading, setLoading] = useState(true);

  // ===== فرم نظر جدید =====
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 0,
    hoverRating: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ===== دریافت نظرات از API =====
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/reviews`);
      if (response.data) {
        setReviews(response.data.reviews || []);
        setStats({
          averageRating: response.data.averageRating || 4.8,
          totalReviews: response.data.totalReviews || 127,
          satisfaction: response.data.satisfaction || 98
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([
        {
          name: t('homePage.reviews.r1name', 'محمد الکعبی'),
          text: t('homePage.reviews.r1text', 'بهترین کباب ایرانی که در دوحه چشیده‌ام. فضای گرم و صمیمی.'),
          rating: 5,
          date: '2024-01-15',
          verified: true
        },
        {
          name: t('homePage.reviews.r2name', 'فاطمه العلی'),
          text: t('homePage.reviews.r2text', 'کیفیت غذا فوق‌العاده است، دقیقاً مثل آشپزی خانگی اصیل ایرانی.'),
          rating: 5,
          date: '2024-01-10',
          verified: true
        },
        {
          name: t('homePage.reviews.r3name', 'احمد راشد'),
          text: t('homePage.reviews.r3text', 'سرویس سریع، طعم اصیل، قیمت مناسب. حتماً دوباره می‌آیم.'),
          rating: 4,
          date: '2024-01-05',
          verified: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [lang, t]);

  // ===== کلاس‌های پویا =====
  const titleColor = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const cardBg = isDark ? 'bg-[#2D2D2D]/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-[#FFD700]/10' : 'border-[#D32F2F]/10';
  const textColor = isDark ? 'text-gray-300' : 'text-[#1A1A1A]';
  const nameColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const shadowColor = isDark ? 'shadow-[#FFD700]/5' : 'shadow-[#D32F2F]/5';
  const quoteColor = isDark ? 'text-[#FFD700]/20' : 'text-[#D32F2F]/20';
  const inputBg = isDark ? 'bg-[#1C1C1C]' : 'bg-white';
  const inputBorder = isDark ? 'border-white/10' : 'border-black/10';
  const inputText = isDark ? 'text-white placeholder-gray-500' : 'text-[#1A1A1A] placeholder-gray-400';

  // ===== نمایش ستاره‌ها (نمایشی) =====
  const renderStars = (rating, size = 16) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={size}
          className={`${s <= rating ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-300'} drop-shadow-[0_0_4px_rgba(255,215,0,0.3)]`}
        />
      ))}
    </div>
  );

  // ===== ستاره‌های تعاملی فرم =====
  const StarInput = () => (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, rating: s }))}
          onMouseEnter={() => setFormData(prev => ({ ...prev, hoverRating: s }))}
          onMouseLeave={() => setFormData(prev => ({ ...prev, hoverRating: 0 }))}
          className="transition-transform hover:scale-125 focus:outline-none"
        >
          <FiStar
            size={28}
            className={`transition-all duration-200 ${
              s <= (formData.hoverRating || formData.rating)
                ? 'text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className={`text-sm font-bold ml-2 ${formData.rating > 0 ? 'text-[#FFD700]' : subtitleColor}`}>
        {formData.rating > 0 ? `${formData.rating} / 5` : t('homePage.reviews.selectRating', 'امتیاز دهید')}
      </span>
    </div>
  );

  // ===== اعتبارسنجی =====
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('homePage.reviews.nameRequired', 'نام خود را وارد کنید');
    if (!formData.text.trim() || formData.text.length < 5) errors.text = t('homePage.reviews.textRequired', 'نظر خود را بنویسید (حداقل ۵ کاراکتر)');
    if (formData.rating === 0) errors.rating = t('homePage.reviews.ratingRequired', 'لطفاً امتیاز دهید');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ===== ارسال نظر =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        text: formData.text.trim(),
        rating: formData.rating,
        date: new Date().toISOString(),
        verified: false,
      };

      try {
        await axios.post(`${API_URL}/api/reviews`, payload);
      } catch (apiErr) {
        console.log('API not available, saving locally');
      }

      setReviews(prev => [payload, ...prev]);
      setStats(prev => ({
        ...prev,
        totalReviews: prev.totalReviews + 1,
      }));

      setFormData({ name: '', text: '', rating: 0, hoverRating: 0 });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== نمایش لودینگ =====
  if (loading) {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="w-16 h-16 mx-auto border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            <p className={`mt-4 ${subtitleColor}`}>{t('loading', 'در حال بارگذاری...')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* ===== پس‌زمینه ===== */}
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

        {/* ===== فرم ارسال نظر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`max-w-2xl mx-auto mb-16 ${cardBg} backdrop-blur-sm rounded-3xl p-6 md:p-8 border ${cardBorder} shadow-xl ${shadowColor}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
              <FiMessageSquare size={20} className={titleColor} />
            </div>
            <div>
              <h3 className={`text-lg font-black ${nameColor}`}>
                {t('homePage.reviews.writeReview', 'نظر شما')}
              </h3>
              <p className={`text-xs ${subtitleColor}`}>
                {t('homePage.reviews.writeReviewDesc', 'تجربه خود را از غذا و سرویس با ما به اشتراک بگذارید')}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2 text-green-400 text-sm font-bold"
              >
                <FiCheckCircle size={18} />
                {t('homePage.reviews.submitSuccess', 'نظر شما با موفقیت ثبت شد!')}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* نام */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('homePage.reviews.yourName', 'نام شما')}
              </label>
              <div className="relative">
                <FiUser size={16} className={`absolute top-1/2 -translate-y-1/2 right-4 ${subtitleColor}`} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder={t('homePage.reviews.namePlaceholder', 'مثلاً: محمد الکعبی')}
                  className={`w-full pr-11 pl-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${isDark ? 'focus:ring-[#FFD700]/20 focus:border-[#FFD700]/50' : 'focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]/50'} ${formErrors.name ? 'border-red-500' : ''}`}
                  dir={lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
            </div>

            {/* امتیاز */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('homePage.reviews.yourRating', 'امتیاز شما')}
              </label>
              <StarInput />
              {formErrors.rating && <p className="text-red-400 text-xs mt-1">{formErrors.rating}</p>}
            </div>

            {/* متن نظر */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('homePage.reviews.yourComment', 'نظر شما')}
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, text: e.target.value }));
                  if (formErrors.text) setFormErrors(prev => ({ ...prev, text: '' }));
                }}
                placeholder={t('homePage.reviews.commentPlaceholder', 'تجربه خود را از غذا و سرویس بنویسید...')}
                rows="3"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all resize-none ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${isDark ? 'focus:ring-[#FFD700]/20 focus:border-[#FFD700]/50' : 'focus:ring-[#D32F2F]/20 focus:border-[#D32F2F]/50'} ${formErrors.text ? 'border-red-500' : ''}`}
                dir={lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr'}
              />
              {formErrors.text && <p className="text-red-400 text-xs mt-1">{formErrors.text}</p>}
            </div>

            {/* دکمه ارسال */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-[#FFD700] text-black hover:bg-[#FFC700] shadow-lg shadow-[#FFD700]/20'
                  : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C] shadow-lg shadow-[#D32F2F]/20'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiSend size={16} />
                  {t('homePage.reviews.submit', 'ارسال نظر')}
                </>
              )}
            </button>
          </form>
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
              <div className={`absolute top-4 right-6 text-6xl ${quoteColor} font-serif select-none`}>
                &ldquo;
              </div>

              <div className={`flex items-center gap-3 mb-4 ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#FFD700]/10'} rounded-full px-3 py-1.5 w-fit`}>
                {renderStars(r.rating || 5)}
                {r.verified && (
                  <span className="text-[10px] text-green-400 font-bold bg-green-500/20 px-2 py-0.5 rounded-full">
                    ✓ {t('comments.verified', 'تایید شده')}
                  </span>
                )}
              </div>

              <p className={`text-sm md:text-base ${textColor} mb-5 leading-relaxed line-clamp-4 transition-colors duration-300`}>
                &ldquo;{r.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#F9A825] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#FFD700]/20">
                    {r.name?.charAt(0) || 'M'}
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
                {r.date && (
                  <span className="text-[10px] text-gray-500">
                    {new Date(r.date).toLocaleDateString('fa-IR')}
                  </span>
                )}
              </div>

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
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>
              {stats.averageRating?.toFixed(1) || '4.8'}
            </p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.avgRating') || 'میانگین امتیاز'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>
              {stats.totalReviews || 0}
            </p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.totalReviews') || 'تعداد نظرات'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-3xl md:text-4xl font-black ${titleColor}`}>
              {stats.satisfaction || 0}%
            </p>
            <p className={`text-xs ${subtitleColor} font-light tracking-wider uppercase`}>
              {t('homePage.reviews.satisfaction') || 'رضایت مشتریان'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}