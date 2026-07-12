import { useCart } from '../../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <button className="relative p-2 text-gray-700 dark:text-gray-200 hover:text-primary transition">
      <FiShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}
