import { useEffect, useState, useCallback } from 'react';

export default function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const close = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  const updateServiceWorker = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().then(() => {
          window.location.reload();
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let intervalId;

    const checkForUpdates = () => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().catch(() => {});
      });
    };

    /* ✅ هر ۶۰ ثانیه چک کن */
    intervalId = setInterval(checkForUpdates, 60000);

    /* ✅ وقتی SW جدید نصب شد */
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    /* ✅ اولین چک */
    checkForUpdates();

    return () => clearInterval(intervalId);
  }, []);

  return { needRefresh, offlineReady, close, updateServiceWorker };
}