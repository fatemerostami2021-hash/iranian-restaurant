import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const navItems = ['home', 'menu', 'about', 'contact'];

export default function MobileNav({ open, onClose }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 end-0 h-full w-72 bg-white dark:bg-surface-dark z-50 md:hidden shadow-2xl p-6 flex flex-col gap-2"
          >
            {navItems.map((key) => (
              <a key={key} href={`#${key === 'home' ? '' : key}`} onClick={onClose} className="py-3 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-metal transition font-medium">
                {t(`nav.${key}`)}
              </a>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
