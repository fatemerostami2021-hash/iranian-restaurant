import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function ArticlePagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const buttonBg = theme === 'dark' ? 'bg-[#2D2D2D]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-[#F7F0E6]' : 'text-[#3E2723]';
  const borderColor = theme === 'dark' ? 'border-[#3E2723]' : 'border-[#E0D5C8]';
  const activeBg = 'bg-[#F4B41A]';

  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* دکمه قبلی */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 rounded-xl border transition-all duration-200
          ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]'}
          ${buttonBg} ${borderColor} ${textColor}
        `}
      >
        <MdChevronRight size={20} />
      </button>

      {/* شماره صفحات */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10 h-10 rounded-xl border transition-all duration-200 text-sm font-medium
            ${currentPage === page 
              ? `${activeBg} text-white border-[#F4B41A] shadow-lg shadow-[#F4B41A]/30` 
              : `${buttonBg} ${borderColor} ${textColor} hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]`
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* دکمه بعدی */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 rounded-xl border transition-all duration-200
          ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]'}
          ${buttonBg} ${borderColor} ${textColor}
        `}
      >
        <MdChevronLeft size={20} />
      </button>
    </div>
  );
}
