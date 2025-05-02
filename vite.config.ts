import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/leaning-music',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'], // opcional
      manifest: {
        name: 'Leaning music',
        short_name: 'LM',
        description: 'App to learning music',
        theme_color: '#ffffff',
        background_color: '##12222200',
        display: 'standalone',
        start_url: '/leaning-music/',
        icons: [
          {
            src: 'icon512_maskable.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
