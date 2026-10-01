import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      
      /* ✅ کلیدی: SW جدید فوراً جایگزین بشه */
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
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
      },
      
      /* ✅ وقتی آپدیت آماده شد، ری‌اکت را مطلع کن */
      devOptions: {
        enabled: false
      }
    })
  ],
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react-dom')) return 'react-dom'
          if (id.includes('node_modules/react/')) return 'react-core'
          if (id.includes('node_modules/scheduler')) return 'react-core'
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) return 'router'
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n'
          if (id.includes('node_modules/framer-motion')) return 'animation'
          if (id.includes('node_modules/react-icons')) return 'icons'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('node_modules/dompurify')) return 'utils'
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) return 'utils'
          if (id.includes('node_modules/swiper')) return 'swiper'
          if (id.includes('node_modules/@heroicons')) return 'icons'
          if (id.includes('node_modules')) return 'vendor'
        },
        
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