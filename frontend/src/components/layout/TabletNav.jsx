import { useTranslation } from 'react-i18next';

const navItems = ['home', 'menu', 'about', 'contact'];

export default function TabletNav() {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex lg:hidden items-center gap-3">
      {navItems.map((key) => (
        <a
          key={key}
          href={`#${key === 'home' ? '' : key}`}
          className="text-gray-700 dark:text-gray-200 hover:text-primary transition text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20"
        >
          {t(`nav.${key}`)}
        </a>
      ))}
    </nav>
  );
}