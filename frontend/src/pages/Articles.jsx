import { useTranslation } from 'react-i18next';
import { MdArticle } from 'react-icons/md';

export default function Articles() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <MdArticle size={32} className="text-primary" />
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
          {t('nav.articles')}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            مطالب خواندنی در حال ساخت است...
          </p>
        </div>
      </div>
    </section>
  );
}
