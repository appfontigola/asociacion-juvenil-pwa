import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/asociacion-juvenil-pwa/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Asociación Juvenil',
        short_name: 'AsocJuvenil',
        description: 'App de gestión para la asociación juvenil',
        theme_color: '#0B151D',
        background_color: '#0B151D',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/asociacion-juvenil-pwa/',
        scope: '/asociacion-juvenil-pwa/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/asociacion-juvenil-pwa/',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'firestore' },
          },
        ],
      },
    }),
  ],
});
