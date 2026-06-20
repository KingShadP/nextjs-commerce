import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // Raise warning threshold — chunks are intentionally split
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Framer Motion — large animation lib, split for cache efficiency
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            // Lucide icons — tree-shaken but sizeable
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            // React + all other node_modules → one stable vendor chunk
            if (id.includes('node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
