import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useTheme } from '../../context/ThemeContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const galleryImages = [
  { src: '/images/gallery/home-gallery1.png', alt: 'Gallery 1', label: 'غذاهای اصیل' },
  { src: '/images/gallery/home-gallery2.png', alt: 'Gallery 2', label: 'سالن VIP' },
  { src: '/images/gallery/home-gallery3.png', alt: 'Gallery 3', label: 'کباب‌های خاص' },
  { src: '/images/gallery/home-gallery4.png', alt: 'Gallery 4', label: 'فضای مدرن' },
  { src: '/images/gallery/home-gallery5.png', alt: 'Gallery 5', label: 'سفره‌های رنگین' },
  { src: '/images/gallery/home-gallery6.png', alt: 'Gallery 6', label: 'لحظات خاص' },
];

export default function CinematicGallery() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;

  // ===== کلاس‌های پویا بر اساس تم =====
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const borderColor = isDark ? 'border-white/10' : 'border-[#D32F2F]/10';
  const bgCard = isDark ? 'bg-white/5' : 'bg-[#D32F2F]/5';
  const gradientFrom = isDark ? 'from-black/80' : 'from-[#1A1A1A]/80';
  const btnBg = isDark ? 'bg-white/10' : 'bg-[#D32F2F]/10';
  const btnBorder = isDark ? 'border-white/20' : 'border-[#D32F2F]/20';
  const btnHover = isDark ? 'hover:bg-[#FFD700]' : 'hover:bg-[#D32F2F]';
  const btnTextHover = isDark ? 'hover:text-black' : 'hover:text-white';

  return (
    <section className={`py-16 md:py-24 bg-transparent overflow-hidden transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* ===== هدر ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className={`font-['Vazirmatn'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black ${titleColor} tracking-tight leading-[1.05] transition-colors duration-300`}>
            {t('homePage.gallery.title') || 'نگاهی به دنیای کباب داغ نان داغ'}
          </h2>
          
          <p className={`font-['Vazirmatn'] text-base sm:text-lg md:text-xl ${subtitleColor} mt-4 max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-300`}>
            {t('homePage.gallery.subtitle') || 'طعم اصیل، فضای لوکس و خاطرات به‌یادماندنی'}
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
            {galleryImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className={`group relative rounded-3xl overflow-hidden border ${borderColor} backdrop-blur-sm ${bgCard} transition-all duration-500 hover:scale-[1.02]`}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} via-black/20 to-transparent`} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <h3 className="font-['Vazirmatn'] text-2xl md:text-3xl lg:text-4xl font-bold">
                      {img.label}
                    </h3>
                    <p className="font-['Vazirmatn'] text-sm md:text-base text-gray-300 mt-1 opacity-90">
                      {t('homePage.gallery.slideSubtitle') || 'کاوش در زیبایی‌های رستوران'}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
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
      </div>
    </section>
  );
}
