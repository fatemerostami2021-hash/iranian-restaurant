import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, Keyboard } from 'swiper/modules';
import { useTheme } from '../../context/ThemeContext';
import { FiX, FiMaximize2, FiMinimize2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';

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
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = galleryImages.length;
  const accentColor = isDark ? '#F4B41A' : '#D32F2F';

  const onAutoplayTimeLeft = useCallback((swiper, time, progressVal) => {
    setProgress((1 - progressVal) * 100);
  }, []);

  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNext = () => setActiveIndex((p) => (p + 1) % total);
  const goPrev = () => setActiveIndex((p) => (p - 1 + total) % total);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') isRtl ? goPrev() : goNext();
      if (e.key === 'ArrowLeft') isRtl ? goNext() : goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, isRtl]);

  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const borderColor = isDark ? 'border-white/10' : 'border-[#D32F2F]/10';
  const bgCard = isDark ? 'bg-white/5' : 'bg-[#D32F2F]/5';
  const gradientFrom = isDark ? 'from-black/80' : 'from-[#1A1A1A]/80';

  return (
    <section className="py-16 md:py-24 bg-transparent overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* هدر */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className={`font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${titleColor} tracking-tight leading-tight`}>
            {t('homePage.gallery.title') || 'نگاهی به دنیای کباب داغ نان داغ'}
          </h2>
          <p className={`text-base sm:text-lg md:text-xl ${subtitleColor} mt-4 max-w-2xl mx-auto font-light`}>
            {t('homePage.gallery.subtitle') || 'طعم اصیل، فضای لوکس و خاطرات به‌یادماندنی'}
          </p>
        </motion.div>

        {/* اسلایدر اصلی */}
        <div dir="ltr">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, Keyboard]}
            effect="coverflow"
            centeredSlides
            slidesPerView={1.2}
            spaceBetween={20}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 150, modifier: 1, slideShadows: true }}
            navigation={{ nextEl: '.gal-next', prevEl: '.gal-prev' }}
            pagination={{ clickable: true, el: '.gal-pagination' }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            keyboard={{ enabled: true }}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 2.5, spaceBetween: 30 },
            }}
            className="cinematic-slider"
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`group relative rounded-3xl overflow-hidden border ${borderColor} backdrop-blur-sm ${bgCard} cursor-zoom-in`}
                  onClick={() => openLightbox(index)}
                >
                  {!imagesLoaded[index] && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800 z-10" />
                  )}
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                    onLoad={() => setImagesLoaded((p) => ({ ...p, [index]: true }))}
                    onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} via-black/20 to-transparent`} />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
                        style={{ backgroundColor: accentColor + '33', color: accentColor }}
                      >
                        {index + 1} / {total}
                      </span>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        {img.label}
                      </h3>
                      <p className="text-sm md:text-base text-gray-300 mt-1">
                        {t('homePage.gallery.slideSubtitle') || 'کاوش در زیبایی‌های رستوران'}
                      </p>
                    </motion.div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                      <FiMaximize2 size={18} />
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* نوار پیشرفت */}
        <div className="max-w-md mx-auto mt-4">
          <div className={`h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'} overflow-hidden`}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              animate={{ width: progress + '%' }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* دکمه‌ها + شمارنده */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className={`gal-prev w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isDark ? 'bg-white/10 border-white/20 hover:bg-[#FFD700] hover:text-black' : 'bg-[#D32F2F]/10 border-[#D32F2F]/20 hover:bg-[#D32F2F] hover:text-white'
          } text-white`}>
            <FiChevronLeft size={22} />
          </button>

          <span className={`text-sm font-bold tabular-nums ${subtitleColor}`}>
            {activeIndex + 1} / {total}
          </span>

          <button className={`gal-next w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isDark ? 'bg-white/10 border-white/20 hover:bg-[#FFD700] hover:text-black' : 'bg-[#D32F2F]/10 border-[#D32F2F]/20 hover:bg-[#D32F2F] hover:text-white'
          } text-white`}>
            <FiChevronRight size={22} />
          </button>
        </div>

        {/* صفحه‌بندی */}
        <div className="gal-pagination flex justify-center mt-4 gap-2" />

        {/* Thumbnails */}
        <div className="mt-8 hidden md:block" dir="ltr">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView={4}
            watchSlidesProgress
            modules={[Thumbs]}
            className="gallery-thumbs"
            breakpoints={{
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={index} className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-20 object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* لایت‌باکس */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="absolute top-5 left-5 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
            </button>

            <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold">
              {activeIndex + 1} / {total}
            </div>

            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[activeIndex].src}
                alt={galleryImages[activeIndex].alt}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-8 left-0 right-0 text-center px-4"
            >
              <h3 className="text-white text-xl md:text-2xl font-bold">{galleryImages[activeIndex].label}</h3>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <FiChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <FiChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}