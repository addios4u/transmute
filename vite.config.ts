import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'webview-src',
  base: './',
  build: {
    outDir: resolve(__dirname, 'out', 'webview'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'webview-src', 'index.tsx'),
      output: {
        format: 'iife',
        entryFileNames: 'webview.js',
        assetFileNames: 'webview.[ext]',
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'webview-src'),
    },
  },
});
