import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';

// ✅ پرچم قطر برای عربی
const languages = [
  { code: 'ar', label: 'العربية', flag: '🇶🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false); // ✅ تبدیل به منوی کلیکی
  const currentLang = i18n.language || 'ar';

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const buttonClasses = theme === 'dark'
    ? 'text-white hover:text-[#FFD700] hover:bg-white/5'
    : 'text-[#1A1A1A] hover:text-[#D32F2F] hover:bg-[#D32F2F]/5';

  const menuClasses = theme === 'dark'
    ? 'bg-[#1C1C1C] border-[#FFD700]/30'
    : 'bg-white border-[#D32F2F]/20';

  // ✅ نمایش نام زبان فعلی به جای فقط پرچم
  const getCurrentLabel = () => {
    const lang = languages.find(l => l.code === currentLang);
    return lang ? lang.label : 'العربية';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all ${buttonClasses}`}
        type="button"
      >
        <MdLanguage size={18} />
        {/* ✅ نام زبان فعلی نوشته می‌شود تا کاربر متوجه شود */}
        <span className="hidden sm:inline">{getCurrentLabel()}</span>
        <span className="text-xs opacity-50">▼</span>
      </button>

      {/* ✅ منوی کشویی با کلیک باز و بسته می‌شود (بهتر برای موبایل) */}
      {open && (
        <div className={`absolute left-0 mt-1 w-40 ${menuClasses} rounded-xl shadow-lg border z-50 overflow-hidden`}>
          {languages.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`
                w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
                ${currentLang === code 
                  ? 'text-[#FFD700] bg-[#FFD700]/10 font-bold' 
                  : `${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-[#1A1A1A] hover:bg-black/5'}`
                }
              `}
            >
              <span className="text-lg">{flag}</span>
              <span>{label}</span>
              {currentLang === code && (
                <span className="mr-auto text-[#FFD700]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}