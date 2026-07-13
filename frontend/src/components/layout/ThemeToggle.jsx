import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const buttonClasses = theme === 'dark'
    ? 'bg-[#F4B41A]/20 hover:bg-[#F4B41A]/40 text-[#F4B41A]'
    : 'bg-[#E67E22]/20 hover:bg-[#E67E22]/40 text-[#E67E22]';

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${buttonClasses} transition-all duration-300`}
      type="button"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
