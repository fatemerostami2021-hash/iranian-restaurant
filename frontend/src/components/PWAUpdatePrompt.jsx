import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function PWAUpdatePrompt() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let intervalId;

    const check = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        registration.update();

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              /* ✅ SW جدید نصب شده ولی هنوز فعال نشده */
              setShow(true);
            }
          });
        });
      } catch (e) {
        console.error('SW check failed:', e);
      }
    };

    /* چک اولیه */
    check();

    /* ✅ هر ۶۰ ثانیه چک کن */
    intervalId = setInterval(check, 60000);

    /* وقتی SW عوض شد، ریلود کن */
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return () => clearInterval(intervalId);
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().then(() => {
          window.location.reload();
        });
      });
    }
  };

  const handleClose = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed bottom-0 inset-x-0 z-[70] p-4 flex items-center justify-center`}
        >
          <div
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl border max-w-md w-full mx-4 ${
              isDark
                ? 'bg-[#1C1C1C] border-white/10 text-white'
                : 'bg-white border-gray-200 text-[#1A1A1A]'
            }`}
          >
            <div className="flex-1">
              <p className="font-bold text-sm">
                {t('pwa.updateTitle', 'نسخه جدید موجود است')}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('pwa.updateDesc', 'برای مشاهده تغییرات جدید، صفحه را بروزرسانی کنید.')}
              </p>
            </div>

            <button
              onClick={handleUpdate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-[#b71c1c] text-white text-sm font-bold transition-colors shrink-0"
            >
              <FiRefreshCw size={16} />
              {t('pwa.updateBtn', 'بروزرسانی')}
            </button>

            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <FiX size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}