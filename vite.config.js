import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Esta linha é crucial para GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});