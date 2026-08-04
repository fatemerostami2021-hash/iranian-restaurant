import { useEffect, useState } from 'react';

const PROMPT_DELAY_MS = 3 * 60 * 1000; // ۳ دقیقه
const COOLDOWN_HOURS = 24;
const STORAGE_KEY = 'auth_prompt_last_shown';

export default function useAuthPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // اگه لاگینه (چه کاربر چه ادمین) نشون نده
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) return;

    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (lastShown) {
      const hoursPassed = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursPassed < COOLDOWN_HOURS) return;
    }

    const timer = setTimeout(() => {
      setShowPrompt(true);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }, PROMPT_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => setShowPrompt(false);

  return { showPrompt, dismiss };
}
