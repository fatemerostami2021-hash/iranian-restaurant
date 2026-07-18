// ============================================
// install-videogallery.js
// کافیه این فایل رو تو روت پروژه‌ت بسازی و با `node install-videogallery.js` اجراش کنی
// ============================================
const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'components', 'home', 'VideoGallery.jsx');
const dir = path.dirname(filePath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  console.log('📁 پوشه ساخته شد: ' + dir);
}

const content = `import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const galleryVideos = [
  {
    id: 'main-showcase',
    src: '/images/video/video1.mp4',
    poster: '/images/video/video1-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.featured',
    categoryFallback: 'ویژه',
    titleKey: 'homePage.videoGallery.videos.main.title',
    titleFallback: 'هنر آشپزی ایرانی',
    descKey: 'homePage.videoGallery.videos.main.desc',
    descFallback: 'سفری سینمایی به دنیای طعم‌های اصیل و فراموش‌نشدنی — از انتخاب بهترین مواد اولیه تا سرو نهایی در بشقاب شما',
    views: 24800,
    likes: 1920,
  },
  {
    id: 'restaurant-tour',
    src: '/images/video/video2.mp4',
    poster: '/images/video/video2-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.space',
    categoryFallback: 'فضا',
    titleKey: 'homePage.videoGallery.videos.tour.title',
    titleFallback: 'تور رستوران',
    descKey: 'homePage.videoGallery.videos.tour.desc',
    descFallback: 'گشتی در فضای لوکس، سالن VIP و طراحی مدرن ما',
    views: 18200,
    likes: 1430,
  },
  {
    id: 'kabab-craft',
    src: '/images/video/video3.mp4',
    poster: '/images/video/video3-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.cooking',
    categoryFallback: 'آشپزی',
    titleKey: 'homePage.videoGallery.videos.kabab.title',
    titleFallback: 'استاد کباب',
    descKey: 'homePage.videoGallery.videos.kabab.desc',
    descFallback: 'هنر کباب کردن به سبک سنتی با ذغال و عطر دود',
    views: 31400,
    likes: 2680,
  },
  {
    id: 'moments',
    src: '/images/video/video4.mp4',
    poster: '/images/video/video4-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.events',
    categoryFallback: 'لحظات',
    titleKey: 'homePage.videoGallery.videos.moments.title',
    titleFallback: 'لحظات خاص',
    descKey: 'homePage.videoGallery.videos.moments.desc',
    descFallback: 'خاطرات مشتریان خوش‌سلیقه ما در شب‌های به‌یادماندنی',
    views: 12600,
    likes: 980,
  },
  {
    id: 'chef-story',
    src: '/images/video/video5.mp4',
    poster: '/images/video/video5-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.team',
    categoryFallback: 'تیم',
    titleKey: 'homePage.videoGallery.videos.chef.title',
    titleFallback: 'داستان سرآشپز',
    descKey: 'homePage.videoGallery.videos.chef.desc',
    descFallback: 'آشنایی با سرآشپز و تیم حرفه‌ای آشپزی ما',
    views: 9800,
    likes: 720,
  },
  {
    id: 'dessert-art',
    src: '/images/video/video6.mp4',
    poster: '/images/video/video6-poster.jpg',
    categoryKey: 'homePage.videoGallery.categories.dessert',
    categoryFallback: 'دسر',
    titleKey: 'homePage.videoGallery.videos.dessert.title',
    titleFallback: 'هنر دسر ایرانی',
    descKey: 'homePage.videoGallery.videos.dessert.desc',
    descFallback: 'ترکیب خلاقانه شیرینی‌های سنتی و مدرن',
    views: 15700,
    likes: 1180,
  },
];

const formatCount = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\\.0$/, '') + 'K';
  return n.toString();
};

const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + s.toString().padStart(2, '0');
};

function MainVideoPlayer({ video, isDark, isLiked, onLike, t }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    setIsPlaying(true);
    setIsMuted(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise) playPromise.catch(() => {});
    }
  }, [video.id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      setProgress(dur > 0 ? (cur / dur) * 100 : 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise) playPromise.catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    videoRef.current.currentTime = pct * duration;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const accentBg = isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]';
  const accentText = isDark ? 'text-black' : 'text-white';
  const controlsBg = isDark ? 'bg-black/70' : 'bg-[#1A1A1A]/70';

  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={\`relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden \${
        isDark ? 'border border-white/10' : 'border border-[#D32F2F]/10'
      } shadow-2xl shadow-black/40\`}
    >
      <div
        className={\`absolute -inset-6 md:-inset-10 \${
          isDark
            ? 'bg-gradient-to-r from-[#FFD700]/30 via-purple-500/20 to-[#FFD700]/30'
            : 'bg-gradient-to-r from-[#D32F2F]/25 via-orange-500/15 to-[#D32F2F]/25'
        } rounded-3xl blur-3xl opacity-60 -z-10 pointer-events-none\`}
      />

      <div className="absolute top-0 left-0 right-0 h-5 md:h-7 bg-black z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-5 md:h-7 bg-black z-30 pointer-events-none" />

      <div
        className="relative aspect-video bg-black cursor-pointer group"
        onClick={togglePlay}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div
                className={\`w-20 h-20 md:w-28 md:h-28 rounded-full \${accentBg} \${accentText} flex items-center justify-center shadow-2xl\`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 md:w-12 md:h-12 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={\`absolute inset-x-0 bottom-7 md:bottom-10 z-20 px-4 md:px-8 transition-opacity duration-300 \${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }\`}
        >
          <div className="pointer-events-auto">
            <motion.span
              key={video.id + '-cat'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`inline-block px-3 py-1 rounded-full \${accentBg} \${accentText} text-[10px] md:text-xs font-black mb-3 uppercase tracking-widest\`}
            >
              {t(video.categoryKey) || video.categoryFallback}
            </motion.span>
            <motion.h3
              key={video.id + '-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-['Vazirmatn'] text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight"
            >
              {t(video.titleKey) || video.titleFallback}
            </motion.h3>
            <motion.p
              key={video.id + '-desc'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-['Vazirmatn'] text-xs sm:text-sm md:text-lg text-gray-200 mt-2 max-w-3xl leading-relaxed"
            >
              {t(video.descKey) || video.descFallback}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2 md:gap-4 flex-wrap mt-3 md:mt-4"
            >
              <div className="flex items-center gap-1.5 text-white text-xs md:text-sm">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                <span className="font-bold">{formatCount(video.views)}</span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onLike(video.id); }}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 \${
                  isLiked ? \`\${accentBg} \${accentText}\` : 'bg-white/20 text-white hover:bg-white/30'
                }\`}
              >
                <motion.svg
                  animate={isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </motion.svg>
                <span className="font-bold text-xs md:text-sm">
                  {formatCount(video.likes + (isLiked ? 1 : 0))}
                </span>
              </button>
            </motion.div>
          </div>
        </div>

        <div
          className={\`absolute inset-x-0 bottom-0 z-20 \${controlsBg} backdrop-blur-md transition-opacity duration-300 \${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }\`}
        >
          <div className="h-1 md:h-1.5 bg-white/20 cursor-pointer relative" onClick={handleProgressClick}>
            <div className={\`h-full \${accentBg} transition-all duration-100\`} style={{ width: progress + '%' }} />
          </div>
          <div className="px-3 md:px-5 py-2 md:py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform p-1">
                {isPlaying ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <span className="text-white text-[10px] md:text-xs font-mono tracking-wider">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform p-1">
              {isMuted ? (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VideoCard({ video, isDark, isLiked, isActive, onSelect, onLike, t, index }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise) playPromise.catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const accentBg = isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]';
  const accentText = isDark ? 'text-black' : 'text-white';
  const accentColorText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const cardBg = isDark ? 'bg-white/5 border-white/10 hover:bg-white/[0.08]' : 'bg-[#D32F2F]/5 border-[#D32F2F]/10 hover:bg-[#D32F2F]/10';
  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const descColor = isDark ? 'text-gray-400' : 'text-[#666666]';
  const metaColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const ringColor = isDark ? 'ring-[#FFD700]' : 'ring-[#D32F2F]';
  const tagBg = isDark ? 'bg-white/10' : 'bg-[#D32F2F]/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(video)}
      className={\`group relative rounded-2xl overflow-hidden cursor-pointer \${cardBg} border backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl \${
        isActive ? \`ring-2 \${ringColor} ring-offset-2 \${isDark ? 'ring-offset-black' : 'ring-offset-white'}\` : ''
      }\`}
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          className={\`w-full h-full object-cover transition-transform duration-700 \${isHovered ? 'scale-110' : 'scale-100'}\`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />
        {duration > 0 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-white text-[10px] md:text-xs font-mono rounded z-20">
            {formatTime(duration)}
          </div>
        )}
        <div className={\`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10 \${isHovered ? 'opacity-0' : 'opacity-100'}\`}>
          <div className={\`w-11 h-11 md:w-14 md:h-14 rounded-full \${accentBg} \${accentText} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform\`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-7 md:h-7 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {isActive && (
          <div className={\`absolute top-2 left-2 px-2 py-1 rounded-full \${accentBg} \${accentText} text-[10px] md:text-xs font-black flex items-center gap-1 z-20\`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {t('homePage.videoGallery.nowPlaying') || 'در حال پخش'}
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h4 className={\`font-['Vazirmatn'] text-sm md:text-base font-bold \${titleColor} line-clamp-1 mb-1.5\`}>
          {t(video.titleKey) || video.titleFallback}
        </h4>
        <p className={\`font-['Vazirmatn'] text-[11px] md:text-xs \${descColor} line-clamp-2 mb-3 leading-relaxed min-h-[2.5em]\`}>
          {t(video.descKey) || video.descFallback}
        </p>
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-current/10">
          <div className={\`flex items-center gap-2.5 text-[11px] md:text-xs \${metaColor}\`}>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
              {formatCount(video.views)}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onLike(video.id); }}
              className={\`flex items-center gap-1 transition-all hover:scale-110 \${isLiked ? \`\${accentColorText} font-bold\` : ''}\`}
            >
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {formatCount(video.likes + (isLiked ? 1 : 0))}
            </button>
          </div>
          {video.categoryFallback && (
            <span className={\`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full \${tagBg} \${metaColor} font-bold uppercase tracking-wider\`}>
              {t(video.categoryKey) || video.categoryFallback}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VideoGallery() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentLang = i18n.language;
  const sectionRef = useRef(null);

  const [activeVideoId, setActiveVideoId] = useState(galleryVideos[0].id);
  const [likedVideos, setLikedVideos] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('videoGalleryLikes');
      if (stored) setLikedVideos(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load likes:', e);
    }
  }, []);

  const handleLike = (id) => {
    setLikedVideos((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('videoGalleryLikes', JSON.stringify(newState));
      } catch (e) {}
      return newState;
    });
  };

  const handleSelectVideo = (video) => {
    setActiveVideoId(video.id);
    if (sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const activeVideo = galleryVideos.find((v) => v.id === activeVideoId) || galleryVideos[0];

  const titleColor = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-[#666666]';
  const accentColorText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const badgeBg = isDark ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' : 'bg-[#D32F2F]/10 border border-[#D32F2F]/20';

  return (
    <section ref={sectionRef} id="video-gallery-section" className="py-16 md:py-24 bg-transparent overflow-hidden transition-colors duration-300" key={currentLang}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
          <div className={\`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 \${badgeBg}\`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className={\`text-[10px] md:text-xs font-black \${accentColorText} font-['Vazirmatn'] uppercase tracking-widest\`}>
              {t('homePage.videoGallery.badge') || 'ویدیوهای اختصاصی'}
            </span>
          </div>
          <h2 className={\`font-['Vazirmatn'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black \${titleColor} tracking-tight leading-[1.05] transition-colors duration-300\`}>
            {t('homePage.videoGallery.title') || 'تجربه‌ای سینمایی از رستوران ما'}
          </h2>
          <p className={\`font-['Vazirmatn'] text-base sm:text-lg md:text-xl \${subtitleColor} mt-4 max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-300\`}>
            {t('homePage.videoGallery.subtitle') || 'نگاهی عمیق به فضا، طعم و لحظات خاص'}
          </p>
        </motion.div>

        <div className="relative mb-12 md:mb-16">
          <AnimatePresence mode="wait">
            <MainVideoPlayer key={activeVideo.id} video={activeVideo} isDark={isDark} isLiked={!!likedVideos[activeVideo.id]} onLike={handleLike} t={t} />
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="flex items-center justify-between mb-5 md:mb-6 px-1">
            <h3 className={\`font-['Vazirmatn'] text-lg md:text-2xl font-bold \${titleColor} flex items-center gap-2\`}>
              <span className={\`w-1 h-5 md:h-6 rounded-full \${isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]'}\`} />
              {t('homePage.videoGallery.relatedTitle') || 'ویدیوهای مرتبط'}
            </h3>
            <span className={\`text-xs md:text-sm font-['Vazirmatn'] \${subtitleColor} font-bold\`}>
              {galleryVideos.length} {t('homePage.videoGallery.videoCount') || 'ویدیو'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {galleryVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} isDark={isDark} isLiked={!!likedVideos[video.id]} isActive={activeVideoId === video.id} onSelect={handleSelectVideo} onLike={handleLike} t={t} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ فایل ساخته شد: ' + filePath);
console.log('📦 حجم: ' + (content.length / 1024).toFixed(1) + ' KB');
console.log('🚀 حالا Vite رو ری‌استارت کن (Ctrl+C و npm run dev)');
