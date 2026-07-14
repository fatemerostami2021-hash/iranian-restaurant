import { useTranslation } from 'react-i18next';

export default function DishCard({ dish, id, highlight }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div
      id={id}
      className={`
        rounded-2xl p-4 transition-all duration-500 border
        ${highlight 
          ? 'ring-2 ring-[#F4B41A] shadow-lg shadow-[#F4B41A]/30 scale-[1.02] bg-[#F4B41A]/5' 
          : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1'
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-bold text-primary-dark dark:text-primary-light line-clamp-1">
          {dish.name?.[lang] || dish.name?.en || 'Unnamed'}
        </h3>
        <span className="text-sm font-bold text-[#F4B41A]">
          {dish.price} QR
        </span>
      </div>
      
      {dish.description?.[lang] && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
          {dish.description[lang]}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{dish.unit || '-'}</span>
        <span className={`px-2 py-0.5 rounded-full ${
          dish.inStock 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {dish.inStock ? 'موجود' : 'ناموجود'}
        </span>
      </div>
    </div>
  );
}
