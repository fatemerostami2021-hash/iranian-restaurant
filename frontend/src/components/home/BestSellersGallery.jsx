import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useTheme } from '../../context/ThemeContext';
import { FiEye, FiStar, FiX, FiAward, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// ===== لیست پرفروش‌ترین غذاها (Best Sellers) =====
const bestSellers = [
  {
    id: '001',
    code: '0018',
    name: { fa: 'کباب برگ', en: 'Barg Kebab', ar: 'كباب برغ' },
    image: '/images/dishes/main/0013.png',
    category: 'main',
    price: 65,
    rating: 4.9,
    orders: 2840,
    description: {
      fa: 'کباب برگ با گوشت گوسفند، زعفران و پیاز - محبوب‌ترین غذای رستوران',
      en: 'Barg kebab with lamb, saffron and onion - The most popular dish',
      ar: 'كباب برغ مع لحم الضأن والزعفران والبصل - الطبق الأكثر شعبية'
    },
    badge: 'پرفروش‌ترین'
  },
  {
    id: '002',
    code: '0029',
    name: { fa: 'جوجه زعفرانی', en: 'Saffron Chicken', ar: 'دجاج بالزعفران' },
    image: '/images/dishes/main/0001.png',
    category: 'main',
    price: 55,
    rating: 4.8,
    orders: 2350,
    description: {
      fa: 'جوجه کباب با زعفران و کره، سرو با برنج زعفرانی',
      en: 'Chicken kebab with saffron and butter, served with saffron rice',
      ar: 'كباب دجاج بالزعفران والزبدة، يقدم مع أرز بالزعفران'
    },
    badge: 'پرفروش'
  },
  {
    id: '003',
    code: '0010',
    name: { fa: 'ریش', en: 'Lamb Chops', ar: 'ريش' },
    image: '/images/dishes/main/0005.png',
    category: 'main',
    price: 85,
    rating: 4.9,
    orders: 1920,
    description: {
      fa: 'دنده بره کبابی با زعفران و کره - غذای لوکس و محبوب',
      en: 'Grilled lamb chops with saffron and butter - A luxurious favorite',
      ar: 'أضلاع خروف مشوية مع الزعفران والزبدة - طبق فاخر ومحبوب'
    },
    badge: 'پرفروش'
  },
  {
    id: '004',
    code: '0064',
    name: { fa: 'باجه داغ', en: 'Baja Dagh', ar: 'باجة داغ' },
    image: '/images/dishes/breakfast/0063.png',
    category: 'breakfast',
    price: 35,
    rating: 4.7,
    orders: 1680,
    description: {
      fa: 'یک صبحانه سنتی و مقوی با تخم‌مرغ، سوسیس و گوجه‌فرنگی کبابی',
      en: 'A traditional hearty breakfast with eggs, sausage and grilled tomatoes',
      ar: 'فطور تقليدي ومغذي مع البيض والنقانق والطماطم المشوية'
    },
    badge: 'محبوب'
  },
  {
    id: '005',
    code: '0030',
    name: { fa: 'سالاد شیرازی', en: 'Shirazi Salad', ar: 'سلطة شيرازي' },
    image: '/images/dishes/appetizer/0030.png',
    category: 'appetizer',
    price: 18,
    rating: 4.6,
    orders: 1540,
    description: {
      fa: 'سالاد تازه با خیار، گوجه، پیاز و سبزیجات',
      en: 'Fresh salad with cucumber, tomato, onion and herbs',
      ar: 'سلطة طازجة مع الخيار والطماطم والبصل والأعشاب'
    },
    badge: 'محبوب'
  },
  {
    id: '006',
    code: '0015',
    name: { fa: 'میکس تیکا', en: 'Mix Tikka', ar: 'ميكس تيكا' },
    image: '/images/dishes/main/0001.png',
    category: 'main',
    price: 72,
    rating: 4.7,
    orders: 1460,
    description: {
      fa: 'ترکیبی از مرغ و گوشت با ادویه‌های مخصوص',
      en: 'Mix of chicken and meat with special spices',
      ar: 'مزيج من الدجاج واللحم مع البهارات الخاصة'
    },
    badge: 'پرفروش'
  }
];

// ===== کامپوننت مودال بزرگنمایی =====
function DishModal({ dish, onClose, isDark }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (!dish) return null;

  const name = dish.name?.[lang] || dish.name?.fa || '';
  const desc = dish.description?.[lang] || dish.description?.fa || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className={`relative max-w-4xl w-full rounded-3xl overflow-hidden ${isDark ? 'bg-[#1C1C1C]' : 'bg-white'} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
            isDark ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-white/80 text-black hover:bg-white'
          } transition-colors`}
        >
          <FiX size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* تصویر */}
          <div className="relative h-64 md:h-auto bg-gray-900">
            <img
              src={dish.image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400/FFD700/000000?text=Best+Seller';
              }}
            />
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white'
            }`}>
              <FiAward size={14} />
              {t('homePage.bestSellers.badge', 'پرفروش‌ترین')}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white text-sm">
              <span className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
                <FiStar className="text-[#FFD700]" /> {dish.rating}
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full">
                {dish.orders.toLocaleString()} {t('homePage.bestSellers.orders', 'سفارش')}
              </span>
            </div>
          </div>

          {/* اطلاعات */}
          <div className={`p-6 md:p-8 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#D32F2F]/10 text-[#D32F2F]'}`}>
                #{dish.code}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t(`menu.categories.${dish.category}`, dish.category)}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-2">{name}</h3>
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {desc}
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20">
              <div>
                <span className="text-2xl font-bold text-[#FFD700]">{dish.price} QR</span>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ⭐ {dish.rating} · {dish.orders.toLocaleString()} {t('homePage.bestSellers.orders', 'سفارش')}
                </p>
              </div>
              <Link
                to={`/menu?category=${dish.category}&highlight=${dish.code}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  background: isDark ? '#FFD700' : '#D32F2F',
                  color: isDark ? 'black' : 'white'
                }}
              >
                <FiEye size={18} />
                {t('homePage.bestSellers.viewInMenu', 'مشاهده در منو')}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== کامپوننت اصلی =====
export default function BestSellersGallery() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;

  const [selectedDish, setSelectedDish] = useState(null);

  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const accentColorText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const badgeBg = isDark ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' : 'bg-[#D32F2F]/10 border border-[#D32F2F]/20';
  const borderColor = isDark ? 'border-white/10' : 'border-[#D32F2F]/10';
  const bgCard = isDark ? 'bg-white/5' : 'bg-[#D32F2F]/5';
  const gradientFrom = isDark ? 'from-black/80' : 'from-[#1A1A1A]/80';
  const btnBg = isDark ? 'bg-white/10' : 'bg-[#D32F2F]/10';
  const btnBorder = isDark ? 'border-white/20' : 'border-[#D32F2F]/20';
  const btnHover = isDark ? 'hover:bg-[#FFD700]' : 'hover:bg-[#D32F2F]';
  const btnTextHover = isDark ? 'hover:text-black' : 'hover:text-white';

  return (
    <section className="py-16 md:py-24 bg-transparent overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* ===== هدر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 ${badgeBg}`}>
            <FiAward className={accentColorText} size={18} />
            <span className={`text-[10px] md:text-xs font-black ${accentColorText} font-['Vazirmatn'] uppercase tracking-widest`}>
              {t('homePage.bestSellers.badge', 'پرفروش‌ترین‌ها')}
            </span>
          </div>
          <h2 className={`font-['Vazirmatn'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black ${titleColor} tracking-tight leading-[1.05] transition-colors duration-300`}>
            {t('homePage.bestSellers.title', 'محبوب‌ترین غذاها')}
          </h2>
          <p className={`font-['Vazirmatn'] text-base sm:text-lg md:text-xl ${subtitleColor} mt-4 max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-300`}>
            {t('homePage.bestSellers.subtitle', 'انتخاب‌های پرفروش و محبوب مشتریان کباب داغ')}
          </p>
        </motion.div>

        {/* ===== اسلایدر با `dir="ltr"` برای جلوگیری از ریختگی ===== */}
        <div dir="ltr">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            centeredSlides={true}
            slidesPerView={1.2}
            spaceBetween={20}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom',
            }}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 2.5, spaceBetween: 30 },
            }}
            className="cinematic-slider"
            key={currentLang}
          >
            {bestSellers.map((dish, index) => {
              const name = dish.name?.[currentLang] || dish.name?.fa || '';

              return (
                <SwiperSlide key={dish.id}>
                  <div 
                    className={`group relative rounded-3xl overflow-hidden border ${borderColor} backdrop-blur-sm ${bgCard} transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
                    onClick={() => setSelectedDish(dish)}
                  >
                    <img
                      src={dish.image}
                      alt={name}
                      className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} via-black/20 to-transparent`} />
                    
                    {/* برچسب پرفروش‌ترین */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FFD700] text-black flex items-center gap-1.5 shadow-lg">
                        <FiAward size={14} />
                        {t('homePage.bestSellers.badge', 'پرفروش‌ترین')}
                      </span>
                    </div>

                    {/* امتیاز و تعداد سفارش */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                      <span className="flex items-center gap-1 bg-black/60 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm">
                        <FiStar className="text-[#FFD700]" size={14} />
                        {dish.rating}
                      </span>
                      <span className="bg-black/60 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm">
                        {dish.orders.toLocaleString()} {t('homePage.bestSellers.orders', 'سفارش')}
                      </span>
                    </div>

                    {/* اطلاعات پایین */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <h3 className="font-['Vazirmatn'] text-2xl md:text-3xl lg:text-4xl font-bold">
                        {name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[#FFD700] font-bold text-xl">{dish.price} QR</span>
                        <span className={`text-sm text-gray-300`}>
                          #{dish.code}
                        </span>
                      </div>
                      <button
                        className="mt-4 px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          background: isDark ? '#FFD700' : '#D32F2F',
                          color: isDark ? 'black' : 'white'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDish(dish);
                        }}
                      >
                        <FiEye size={16} />
                        {t('homePage.bestSellers.view', 'مشاهده')}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ===== دکمه‌های ناوبری ===== */}
        <div className="flex justify-center gap-4 mt-6">
          <button className={`swiper-button-prev w-12 h-12 md:w-14 md:h-14 rounded-full ${btnBg} backdrop-blur-sm border ${btnBorder} text-white flex items-center justify-center ${btnHover} ${btnTextHover} transition-all duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className={`swiper-button-next w-12 h-12 md:w-14 md:h-14 rounded-full ${btnBg} backdrop-blur-sm border ${btnBorder} text-white flex items-center justify-center ${btnHover} ${btnTextHover} transition-all duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* ===== صفحه‌بندی ===== */}
        <div className="swiper-pagination-custom flex justify-center mt-6 gap-2" />

        {/* دکمه مشاهده همه */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg"
            style={{
              background: isDark ? '#FFD700' : '#D32F2F',
              color: isDark ? 'black' : 'white'
            }}
          >
            {t('homePage.bestSellers.viewAll', 'مشاهده همه غذاها')}
            <FiChevronRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* مودال بزرگنمایی */}
      <AnimatePresence>
        {selectedDish && (
          <DishModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </section>
  );
}