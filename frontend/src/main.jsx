import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n.js';
import './index.css';
import App from './App.jsx';

// ✅ این خط برای فعال کردن PWA اضافه شد
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// ✅ این خط برای ثبت خودکار اپلیکیشن اضافه شد
registerSW({ immediate: true });