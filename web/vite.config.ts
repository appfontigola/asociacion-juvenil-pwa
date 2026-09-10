import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/asociacion-juvenil-pwa/',
  plugins: [
    react(),
  ],
});
