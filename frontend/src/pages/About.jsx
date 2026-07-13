import { useTranslation } from 'react-i18next';
import { MdInfo } from 'react-icons/md';

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <MdInfo size={32} className="text-primary" />
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
          {t('nav.about')}
        </h1>
      </div>
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          درباره ما در حال ساخت است...
        </p>
      </div>
    </section>
  );
}
