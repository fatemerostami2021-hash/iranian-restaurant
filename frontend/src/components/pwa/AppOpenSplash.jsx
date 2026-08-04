import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import GalaxyFireBurst from './GalaxyFireBurst';

function isRunningStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

const AUTO_DISMISS_MS = 2400;

/**
 * فقط وقتی اپ از حالت نصب‌شده (Standalone / Home Screen) باز می‌شه،
 * یه اسپلش تمام‌صفحه با افکت انفجار کهکشانی + آتش نشون می‌ده.
 * تو حالت مرورگر معمولی (نه نصب‌شده)، این کامپوننت اصلاً هیچی رندر نمی‌کنه.
 */
export default function AppOpenSplash() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isRunningStandalone()) return;

    setShouldRender(true);
    // یه فریم صبر می‌کنیم تا مطمئن بشیم mount کامل شده، بعد نمایش می‌دیم
    const showTimer = requestAnimationFrame(() => setVisible(true));

    const hideTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!shouldRender) return null;

  const bgClass = isDark ? 'bg-[#0a0a0a]' : 'bg-[#FFF8F0]';

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          onClick={() => setVisible(false)} // ✅ ضربه/کلیک برای رد کردن زودتر
          className={`fixed inset-0 z-[100] flex items-center justify-center ${bgClass}`}
        >
          <GalaxyFireBurst isDark={isDark} />

          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 11, stiffness: 190 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`w-24 h-24 rounded-3xl overflow-hidden border-2 ${isDark ? 'border-[#FFD700]/60' : 'border-[#D32F2F]/50'} mb-4`}
              style={{ boxShadow: `0 0 45px 8px ${isDark ? 'rgba(255,215,0,0.4)' : 'rgba(211,47,47,0.35)'}` }}
            >
              <img
                src="/images/logo/logo-header.png"
                alt="Kabab Dagh Nan Dagh"
                className="w-full h-full object-cover"
              />
            </div>
            <p className={`text-sm font-black tracking-wide ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {t('pwaInstall.welcomeBack', 'خوش اومدی!')}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}