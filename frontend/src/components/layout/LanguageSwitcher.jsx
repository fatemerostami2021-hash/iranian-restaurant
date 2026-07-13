import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

const languages = [
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const currentLang = i18n.language || 'fa';

  const buttonClasses = theme === 'dark'
    ? 'text-white hover:text-[#F4B41A] hover:bg-white/5'
    : 'text-[#3E2723] hover:text-[#E67E22] hover:bg-[#E67E22]/5';

  const menuClasses = theme === 'dark'
    ? 'bg-[#1C1C1C] border-[#E67E22]/30'
    : 'bg-[#F7F0E6] border-[#E67E22]/20';

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${buttonClasses}`}
        type="button"
      >
        <MdLanguage size={18} />
        <span className="hidden sm:inline">
          {languages.find(l => l.code === currentLang)?.flag || '🌐'}
        </span>
        <span className="text-xs opacity-50">▼</span>
      </button>

      <div className={`absolute right-0 mt-1 w-40 ${menuClasses} rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
        {languages.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`
              w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
              ${currentLang === code 
                ? 'text-[#F4B41A] bg-[#F4B41A]/10' 
                : `${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#3E2723] hover:bg-[#E67E22]/5'}`
              }
              ${code === 'fa' ? 'rounded-t-xl' : ''}
              ${code === 'ar' ? 'rounded-b-xl' : ''}
            `}
          >
            <span>{flag}</span>
            <span>{label}</span>
            {currentLang === code && (
              <span className="mr-auto text-[#F4B41A]">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
