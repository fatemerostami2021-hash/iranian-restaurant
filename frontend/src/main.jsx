import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n.js';
import './index.css';
import App from './App.jsx';

// ✅ اضافه شد برای SEO و Social Preview
import { HelmetProvider } from 'react-helmet-async';

// این خط برای فعال کردن PWA اضافه شده بود
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ کل اپلیکیشن در HelmetProvider پیچیده شد تا تگ‌های متا را بشناسد */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

// این خط برای ثبت خودکار اپلیکیشن اضافه شده بود
registerSW({ immediate: true });