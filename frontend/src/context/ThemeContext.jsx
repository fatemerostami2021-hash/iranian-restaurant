import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// ===== رنگ‌های تم لایت (قرمز و طلایی) =====
const lightTheme = {
  background: '#FFF8F0',
  backgroundCard: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  primary: '#D32F2F',
  primaryDark: '#B71C1C',
  primaryLight: '#F44336',
  secondary: '#FFD700',
  secondaryDark: '#F9A825',
  border: '#E0D5C8',
  shadow: 'rgba(211, 47, 47, 0.1)',
};

// ===== رنگ‌های تم تاریک =====
const darkTheme = {
  background: '#1C1C1C',
  backgroundCard: '#2D2D2D',
  text: '#F7F0E6',
  textMuted: '#BDBDBD',
  primary: '#F4B41A',
  primaryDark: '#E67E22',
  primaryLight: '#F5C842',
  secondary: '#F4B41A',
  secondaryDark: '#E67E22',
  border: '#3E2723',
  shadow: 'rgba(244, 180, 26, 0.1)',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // ===== تابع دریافت رنگ‌های تم فعلی =====
  const getThemeColors = () => {
    return theme === 'dark' ? darkTheme : lightTheme;
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colors: getThemeColors(),
      isDark: theme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export { ThemeContext };
