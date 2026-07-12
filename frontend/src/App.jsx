import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <CartProvider>
        <Layout>
          <section className="max-w-6xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark dark:text-primary-light mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t('hero.subtitle')}
            </p>
            <button className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition">
              {t('hero.cta')}
            </button>
          </section>
        </Layout>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
