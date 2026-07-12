import { useTranslation } from 'react-i18next';

const navItems = ['home', 'menu', 'about', 'contact'];

export default function DesktopNav() {
  const { t } = useTranslation();

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {navItems.map((key) => (
        <a key={key} href={`#${key === 'home' ? '' : key}`} className="relative text-gray-700 dark:text-gray-200 hover:text-primary transition text-sm font-medium group">
          {t(`nav.${key}`)}
          <span className="absolute -bottom-1 start-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
        </a>
      ))}
    </nav>
  );
}
