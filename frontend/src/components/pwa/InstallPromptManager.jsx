import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShare, FiPlusSquare } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import GalaxyFireBurst from './GalaxyFireBurst'; // ✅ اضافه شد

const STORAGE_KEY = 'dagh_pwa_install_state';
const COOLDOWN_DAYS = 7;
const BANNER_DELAY_MS = 3500;

/* ===== توابع کمکی برای خواندن/نوشتن وضعیت در localStorage ===== */
function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { dismissedAt: null, dismissCount: 0, installed: false };
  } catch {
    return { dismissedAt: null, dismissCount: 0, installed: false };
  }
}

function writeState(partial) {
  try {
    const current = readState();
    const next = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return readState();
  }
}

function isCooldownActive(state) {
  if (!state.dismissedAt) return false;
  const daysPassed = (Date.now() - state.dismissedAt) / (1000 * 60 * 60 * 24);
  return daysPassed < COOLDOWN_DAYS;
}

function isRunningStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
}

export default function InstallPromptManager() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isRtl = i18n.language === 'fa' || i18n.language === 'ar';

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [view, setView] = useState('none'); // 'none' | 'banner' | 'modal' | 'ios-instructions'

  const accentBg = isDark ? 'bg-[#FFD700] text-black' : 'bg-[#D32F2F] text-white';
  const accentText = isDark ? 'text-[#FFD700]' : 'text-[#D32F2F]';
  const cardBg = isDark ? 'bg-[#1C1C1C] border-white/10' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-[#1A1A1A]';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-600';

  /* ===== تصمیم‌گیری اینکه چه چیزی نشون داده بشه ===== */
  const decideView = useCallback((hasNativePrompt, iosDevice) => {
    if (isRunningStandalone()) return 'none';

    const state = readState();
    if (state.installed) return 'none';
    if (isCooldownActive(state)) return 'none';
    if (!hasNativePrompt && !iosDevice) return 'none';

    return state.dismissCount === 0 ? 'banner' : 'modal';
  }, []);

  useEffect(() => {
    const iosDevice = isIOSDevice();
    setIsIOS(iosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const timer = setTimeout(() => {
        setView(decideView(true, iosDevice));
      }, BANNER_DELAY_MS);
      return () => clearTimeout(timer);
    };

    const handleAppInstalled = () => {
      writeState({ installed: true });
      setView('none');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    let iosTimer;
    if (iosDevice && !isRunningStandalone()) {
      iosTimer = setTimeout(() => {
        setView(decideView(false, true));
      }, BANNER_DELAY_MS);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    const state = readState();
    writeState({ dismissedAt: Date.now(), dismissCount: (state.dismissCount || 0) + 1 });
    setView('none');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setView('ios-instructions');
      return;
    }
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      writeState({ installed: true });
    } else {
      const state = readState();
      writeState({ dismissedAt: Date.now(), dismissCount: (state.dismissCount || 0) + 1 });
    }
    setDeferredPrompt(null);
    setView('none');
  };

  const appIcon = '/images/logo/logo-header.png';

  /* ============================================================
     لایه ۱: بنر ملایم پایین صفحه
  ============================================================ */
  const Banner = (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[70] rounded-2xl border shadow-2xl ${cardBg} p-3.5 flex items-center gap-3`}
    >
      <img src={appIcon} alt="Kabab Dagh Nan Dagh" className="w-11 h-11 rounded-xl object-contain shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-black leading-tight ${textClass}`}>
          {t('pwaInstall.bannerTitle', 'کباب داغ نان داغ رو نصب کن')}
        </p>
        <p className={`text-xs font-medium leading-tight mt-0.5 ${mutedClass}`}>
          {t('pwaInstall.bannerSubtitle', 'سفارش سریع‌تر، دسترسی راحت‌تر')}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap ${accentBg} hover:opacity-90 transition-opacity`}
        >
          {t('pwaInstall.installBtn', 'نصب')}
        </button>
        <button
          onClick={handleDismiss}
          aria-label="close"
          className={`p-2 rounded-xl ${mutedClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
        >
          <FiX size={16} />
        </button>
      </div>
    </motion.div>
  );

  /* ============================================================
     لایه ۲: Modal حرفه‌ای‌تر با افکت انفجار کهکشانی + آتش
  ============================================================ */
  const benefits = [
    t('pwaInstall.benefit1', 'سفارش سریع‌تر بدون باز کردن مرورگر'),
    t('pwaInstall.benefit2', 'دسترسی به منو حتی با اینترنت ضعیف'),
    t('pwaInstall.benefit3', 'اطلاع از تخفیف‌ها و پیشنهادهای ویژه'),
  ];

  const Modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`relative w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${cardBg}`}
      >
        {/* ✅ افکت انفجار کهکشانی + آتش، پشت محتوا */}
        <GalaxyFireBurst isDark={isDark} />

        {/* نوار تزئینی بالای Modal با گرادینت برند */}
        <div className={`relative z-10 h-1.5 w-full ${isDark ? 'bg-gradient-to-r from-[#FFD700] via-[#F9A825] to-[#FFD700]' : 'bg-gradient-to-r from-[#D32F2F] via-[#B71C1C] to-[#D32F2F]'}`} />

        <div className="relative z-10 p-6 text-center">
          <button
            onClick={handleDismiss}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1.5 rounded-full ${mutedClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-20`}
          >
            <FiX size={18} />
          </button>

          <motion.div
            initial={{ scale: 0.3, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 200 }}
            className={`relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 ${isDark ? 'border-[#FFD700]/50' : 'border-[#D32F2F]/40'} shadow-lg mb-4`}
            style={{ boxShadow: `0 0 30px 4px ${isDark ? 'rgba(255,215,0,0.35)' : 'rgba(211,47,47,0.3)'}` }}
          >
            <img src={appIcon} alt="Kabab Dagh Nan Dagh" className="w-full h-full object-cover" />
          </motion.div>

          <h3 className={`text-xl font-black mb-1.5 ${textClass}`}>
            {t('pwaInstall.modalTitle', 'اپلیکیشن ما رو نصب کن')}
          </h3>
          <p className={`text-sm font-semibold mb-5 ${mutedClass}`}>
            {t('pwaInstall.modalSubtitle', 'تجربه‌ای سریع‌تر و راحت‌تر برای سفارش غذای مورد علاقه‌ت')}
          </p>

          <div className="space-y-2.5 mb-6 text-start">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]'}`} />
                <span className={`text-sm font-semibold ${textClass}`}>{b}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleInstallClick}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm ${accentBg} hover:opacity-90 transition-opacity shadow-lg mb-2.5`}
          >
            <FiDownload size={18} />
            {t('pwaInstall.installBtn', 'نصب')}
          </button>
          <button
            onClick={handleDismiss}
            className={`w-full py-2.5 rounded-2xl font-bold text-sm ${mutedClass} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            {t('pwaInstall.laterBtn', 'شاید بعداً')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  /* ============================================================
     راهنمای iOS (چون Safari پرامپت خودکار نداره)
  ============================================================ */
  const IosInstructions = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${cardBg}`}
      >
        <div className={`h-1.5 w-full ${isDark ? 'bg-gradient-to-r from-[#FFD700] via-[#F9A825] to-[#FFD700]' : 'bg-gradient-to-r from-[#D32F2F] via-[#B71C1C] to-[#D32F2F]'}`} />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-lg font-black ${textClass}`}>
              {t('pwaInstall.iosTitle', 'نصب روی آیفون')}
            </h3>
            <button onClick={handleDismiss} className={`p-1.5 rounded-full ${mutedClass} hover:bg-black/5 dark:hover:bg-white/5`}>
              <FiX size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
                <FiShare size={18} className={accentText} />
              </div>
              <p className={`text-sm font-semibold ${textClass}`}>
                {t('pwaInstall.iosStep1', 'روی آیکون Share (اشتراک‌گذاری) پایین صفحه بزن')}
              </p>
            </div>
            <div className="flex items-center gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
                <FiPlusSquare size={18} className={accentText} />
              </div>
              <p className={`text-sm font-semibold ${textClass}`}>
                {t('pwaInstall.iosStep2', '"Add to Home Screen" رو انتخاب کن')}
              </p>
            </div>
            <div className="flex items-center gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-[#FFD700]/10' : 'bg-[#D32F2F]/10'}`}>
                <span className={`font-black text-sm ${accentText}`}>✓</span>
              </div>
              <p className={`text-sm font-semibold ${textClass}`}>
                {t('pwaInstall.iosStep3', 'روی "Add" بزن، تمام!')}
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className={`w-full mt-6 py-3 rounded-2xl font-black text-sm ${accentBg} hover:opacity-90 transition-opacity`}
          >
            {t('pwaInstall.gotIt', 'متوجه شدم')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {view === 'banner' && Banner}
      {view === 'modal' && Modal}
      {view === 'ios-instructions' && IosInstructions}
    </AnimatePresence>
  );
}