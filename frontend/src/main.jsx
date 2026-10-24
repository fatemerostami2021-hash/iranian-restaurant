import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext.jsx';
import { registerSW } from 'virtual:pwa-register';
import './i18n.js';
import './index.css';
import './lib/smoothScroll.js';
import App from './App.jsx';

// NOTE: GoogleOAuthProvider was removed from here. It loads accounts.google.com/gsi/client
// (~200KB) on every page. It now lives inside GoogleLoginButtonInner.jsx and only mounts
// when the login button is actually rendered.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);

// Register the service worker after the page is idle, so its precache downloads
// do not compete with the first render for bandwidth.
const startSW = () => registerSW({ immediate: true });
window.addEventListener(
  'load',
  () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(startSW, { timeout: 8000 });
    else setTimeout(startSW, 4000);
  },
  { once: true }
);
