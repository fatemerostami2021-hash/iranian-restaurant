import { useTranslation } from 'react-i18next';
import { FiInstagram, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-surface-metal mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-primary-dark dark:text-primary-light mb-2">
            {t('restaurant.name')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Salwa Road, Doha, Qatar
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <FiMapPin size={16} />
            <span>Salwa Road, Doha</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone size={16} />
            <span dir="ltr">+974 XXXX XXXX</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {t('footer.followUs')}
          </p>
          <a
            href="https://www.instagram.com/kabab.dagh.nan.dagh"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition"
          >
            <FiInstagram size={18} />
            Instagram
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 border-t border-gray-100 dark:border-surface-metal">
        &copy; 2026 {t('restaurant.name')} - {t('footer.rights')}
      </div>
    </footer>
  );
}