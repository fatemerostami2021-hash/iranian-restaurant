import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'images/application/pwa-192x192.png'],
      
      // ✅ تنظیمات کش آفلاین برای منو و API
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // کش کردن عکس‌های آپلود شده و استاتیک
            urlPattern: /^https:\/\/.*\/uploads\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            // کش کردن داده‌های منو (آفلاین لود شدن منو)
            urlPattern: /^https?:\/\/.*\/api\/dishes/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'menu-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } // 24 ساعت
            }
          }
        ]
      },

      manifest: {
        name: 'Kabab Dagh Nan Dagh',
        short_name: 'Kabab Dagh',
        description: 'Authentic Iranian Kebab & Catering in Doha',
        theme_color: '#D32F2F',
        background_color: '#0F0F0F',
        display: 'standalone',
        dir: 'rtl',
        lang: 'fa', // ✅ زبان پیش‌فرض اضافه شد
        start_url: '/',
        icons: [
          {
            src: 'images/application/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/application/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'images/application/pwa-512x512.png', // نکته: بعداً یک نسخه maskable با پدینگ بسازید
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})