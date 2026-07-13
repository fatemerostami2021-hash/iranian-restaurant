import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-primary-dark dark:text-primary-light mb-4">
        {t('hero.title')}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
        {t('hero.subtitle')}
      </p>
      <Link 
        to="/menu"
        className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition shadow-lg hover:shadow-xl"
      >
        {t('hero.cta')}
      </Link>
    </section>
  );
}
