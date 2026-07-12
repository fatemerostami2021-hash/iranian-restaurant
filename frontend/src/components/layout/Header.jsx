import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMenu } from 'react-icons/fi';
import { GiKebabSpit } from 'react-icons/gi';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import TabletNav from './TabletNav';
import CartIcon from '../ui/CartIcon';

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-surface-dark/90 backdrop-blur border-b border-gray-100 dark:border-surface-metal">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-2 shrink-0">
            <GiKebabSpit size={26} className="text-primary shrink-0" />
            <span className="text-lg font-bold text-primary-dark dark:text-primary-light whitespace-nowrap">
              {t('restaurant.name')}
            </span>
          </a>

          <DesktopNav />
          <TabletNav />

          <div className="flex items-center gap-2 shrink-0">
            <CartIcon />
            <LanguageSwitcher />
            <ThemeToggle />

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200"
              aria-label="Open menu"
              type="button"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
