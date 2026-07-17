import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartDrawer from './CartDrawer';

export default function CartIcon() {
  const { totalItems } = useCart();
  const { theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-[#F7F0E6]' : 'text-[#1A1A1A]';
  const badgeBg = isDark ? 'bg-[#FFD700]' : 'bg-[#D32F2F]';
  const badgeText = isDark ? 'text-[#1A1A1A]' : 'text-white';

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-300 group"
        aria-label="Open cart"
      >
        <FiShoppingCart size={22} className={textColor} />
        {totalItems > 0 && (
          <span className={`absolute -top-1 -right-1 ${badgeBg} ${badgeText} text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            {totalItems}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
