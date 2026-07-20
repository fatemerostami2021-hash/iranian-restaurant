import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function About() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lang = i18n.language; // تشخیص زبان فعلی

  const stats = [
    { key: 'statsYears', value: '8+' },
    { key: 'statsDishes', value: '78' },
    { key: 'statsCustomers', value: '50K+' },
    { key: 'statsRating', value: '4.8' },
  ];

  // متن‌های ۳ زبانه مستقیم در کد
  const storyP3Text = lang === 'fa' 
    ? 'امروز، در قلب دوحه، کباب داغ نان داغ نه فقط یک رستوران، بلکه پلی است میان فرهنگ غنی ایران و مهمان‌نوازی گرم قطر. جایی که هر لقمه، داستانی از عشق به غذا، احترام به سنت و لذت لحظه را روایت می‌کند. اینجا هر غذایی، بیش از یک وعده؛ یک خاطرهٔ ماندگار است.'
    : lang === 'ar' 
    ? 'اليوم، في قلب الدوحة، مطعم كباب داغ نان داغ ليس مجرد مطعم، بل جسر بين ثقافة إيران الغنية وكرم الضيافة القطري. مكان حيث كل قضمة تحكي قصة حب للطعام، واحترام للتقاليد، وفرحة اللحظة. هنا، كل وجبة هي أكثر من مجرد طبق؛ إنها ذكرى لا تُنسى.'
    : 'Today, in the heart of Doha, Kabab Dagh Nan Dagh is not just a restaurant, but a bridge between the rich culture of Iran and the warm hospitality of Qatar. A place where every bite tells a story of love for food, respect for tradition, and the joy of the moment. Here, every meal is more than a course; it is a lasting memory.';

  const highlightQuoteText = lang === 'fa'
    ? 'به ما بپیوندید و طعم اصیل ایران را، داغ و پرشور، تجربه کنید. کباب داغ، نان داغ — جایی که آتش عشق هرگز خاموش نمی‌شود.'
    : lang === 'ar'
    ? 'انضم إلينا وتذوق النكهة الإيرانية الأصيلة، ساخنة ومليئة بالشغف. كباب داغ، نان داغ — حيث لا تنطفئ نار الحب أبداً.'
    : 'Join us and experience the authentic taste of Iran, hot and passionate. Kabab Dagh, Nan Dagh — where the fire of love never goes out.';

  // متغیرهای رنگی پویا
  const bgClass = isDark ? 'bg-[#0F0F0F]' : 'bg-[#FFFBF5]';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-700';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const accentBorder = isDark ? 'border-[#FFD700]' : 'border-[#D32F2F]';
  const accentBg = isDark ? 'bg-[#FFD700]/5' : 'bg-[#D32F2F]/5';
  const accentGlow = isDark ? 'rgba(255, 215, 0, 0.4)' : 'rgba(211, 47, 47, 0.4)';
  const btnClass = isDark ? 'bg-[#FFD700] text-black hover:bg-[#FFC700]' : 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]';

  return (
    <div className={`overflow-hidden ${bgClass} ${textClass} transition-colors duration-500`}>
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/about/story.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`relative z-10 bg-white/5 border ${isDark ? 'border-[#FFD700]/30' : 'border-white/30'} backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-3xl mx-4 shadow-2xl`}
        >
          <span className={`inline-block text-sm tracking-[0.3em] uppercase mb-4 font-bold ${accentText}`}>
            Kabab Dagh Nan Dagh
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {t('aboutPage.heroTitle', 'داستانی که با آتش آغاز شد')}
          </h1>
          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            {t('aboutPage.heroSubtitle', 'از دل ایران تا قلب دوحه، طعمی که نسل‌ها به ارث برده‌اند.')}
          </p>
        </motion.div>
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {t('aboutPage.storyTitle', 'داستان ما، قصهٔ آتش و عشق است.')}
          </h2>
          <p className={`text-base md:text-lg leading-relaxed ${mutedClass}`}>
            {t('aboutPage.storyP1', 'در سال ۲۰۱۸، رستوران کباب داغ نان داغ از یک رویای ساده اما عمیق زاده شد: بازآفرینی طعم اصیل و ناب ایرانی در سرزمین قطر. جایی که هر سیخ کباب با دستان ماهر و قلب‌هایی پر از شور پخته می‌شود، هر نان تازه از تنور بیرون می‌آید و هر خورش، بوی خانه و خاطرات کودکی را با خود به ارمغان می‌آورد.')}
          </p>
          <p className={`text-base md:text-lg leading-relaxed ${mutedClass}`}>
            {t('aboutPage.storyP2', 'دستورها، رازهایی هستند که از نسلی به نسل دیگر، در خانواده‌های ایرانی منتقل شده‌اند؛ از سفره‌های سنتی مادربزرگ‌ها تا آشپزخانه‌های مدرن امروز. ما این میراث گران‌بها را با افتخار به دوحه آوردیم و با بالاترین استانداردهای کیفی و بهداشت، به شما تقدیم می‌کنیم.')}
          </p>
          
          {/* پاراگراف سوم (۳ زبانه مستقیم در کد) */}
          <p className={`text-base md:text-lg leading-relaxed ${mutedClass}`}>
            {storyP3Text}
          </p>
          
          {/* جمله طلایی (۳ زبانه مستقیم در کد) */}
          <div className={`mt-8 p-6 border-r-4 ${accentBorder} ${accentBg} rounded-l-2xl`}>
            <p className={`text-lg md:text-xl font-bold ${accentText} leading-relaxed`}>
              {highlightQuoteText}
            </p>
          </div>
        </motion.div>

        {/* عکس مدیر با افکت ۳ بعدی و هایلایت */}
        <motion.div
          variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="relative flex justify-center group"
        >
          {/* لایه درخشش پشت عکس */}
          <div 
            className="absolute inset-0 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 scale-105" 
            style={{ background: `radial-gradient(circle, ${accentGlow}, transparent 70%)` }}
          ></div>
          
          {/* قاب ۳ بعدی عکس */}
          <div className={`relative w-full max-w-xl aspect-[4/5] rounded-3xl overflow-hidden border-4 ${accentBorder} transition-transform duration-500 group-hover:scale-105`}
               style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 8px rgba(255, 255, 255, 0.05)' }}
          >
            <img
              src="/images/about/manager.png"
              alt="Amir Rostami - Manager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Amir+Rostami'; }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-10 text-center">
              <h3 className="text-white text-3xl font-black mb-1">امیر رستمی</h3>
              <p className={`text-sm font-medium tracking-wider ${accentText}`}>
                {t('aboutPage.managerRole', 'مؤسس و مدیر رستوران')}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION (Glassmorphism Cards) ===== */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.key} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} text-center backdrop-blur-md`}
            >
              <div className={`text-4xl md:text-5xl font-black mb-2 ${accentText}`}>{s.value}</div>
              <div className={`text-sm md:text-base font-medium ${mutedClass}`}>
                {t('aboutPage.' + s.key)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative z-10 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            {t('aboutPage.ctaTitle', 'آماده تجربه طعم واقعی هستید؟')}
          </h2>
          <Link
            to="/menu"
            className={`inline-block px-10 py-4 ${btnClass} font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg ${isDark ? 'shadow-[#FFD700]/30' : 'shadow-[#D32F2F]/30'}`}
          >
            {t('aboutPage.ctaButton', 'مشاهده منو')}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}