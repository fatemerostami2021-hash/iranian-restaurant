import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      
      includeAssets: [
        'favicon.ico', 
        'robots.txt',
        'manifest.json',
        'images/application/pwa-192x192.png',
        'images/application/pwa-512x512.png',
        'images/application/pwa-maskable-192.png',
        'images/application/pwa-maskable-512.png'
      ],
      
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/uploads\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { 
                maxEntries: 100, 
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https?:\/\/.*\/api\/dishes/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'menu-api-cache',
              expiration: { 
                maxEntries: 50, 
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      }
    })
  ],
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    /* ✅ حذف اخطار chunk بزرگ */
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          /* ===== React Core ===== */
          if (id.includes('node_modules/react-dom')) return 'react-dom'
          if (id.includes('node_modules/react/')) return 'react-core'
          if (id.includes('node_modules/scheduler')) return 'react-core'
          
          /* ===== Router ===== */
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) return 'router'
          
          /* ===== i18n ===== */
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n'
          
          /* ===== Animation ===== */
          if (id.includes('node_modules/framer-motion')) return 'animation'
          
          /* ===== Icons ===== */
          if (id.includes('node_modules/react-icons')) return 'icons'
          
          /* ===== HTTP Client ===== */
          if (id.includes('node_modules/axios')) return 'http'
          
          /* ===== Utilities ===== */
          if (id.includes('node_modules/dompurify')) return 'utils'
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) return 'utils'
          
          /* ===== Other vendors (each major lib separate) ===== */
          if (id.includes('node_modules/swiper')) return 'swiper'
          if (id.includes('node_modules/@heroicons')) return 'icons'
          
          /* ===== Remaining node_modules ===== */
          if (id.includes('node_modules')) return 'vendor'
        },
        
        /* ✅ نام‌گذاری تمیز فایل‌ها */
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (info) => {
          const infoSrc = info.name || ''
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(infoSrc)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.css$/.test(infoSrc)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          if (/\.(woff2?|ttf|otf|eot)$/.test(infoSrc)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  
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