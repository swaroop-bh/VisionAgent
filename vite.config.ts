import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

const copyManifestPlugin = () => ({
  name: 'copy-manifest',
  closeBundle() {
    const src = resolve(__dirname, 'extension/manifest.json');
    const dest = resolve(__dirname, 'dist/manifest.json');
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log('✓ manifest.json copied to dist/');
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyManifestPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './extension'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'extension/sidepanel/index.html'),
        popup: resolve(__dirname, 'extension/popup/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    open: '/extension/sidepanel/index.html',
  },
});
