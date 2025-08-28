import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': './src',
    },
  },
  // Optimisations pour les performances
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  // Optimisations pour le développement
  server: {
    hmr: {
      overlay: false,
    },
    // Optimisations pour réduire les temps de chargement
    fs: {
      strict: false,
    },
  },
  // Optimisations CSS
  css: {
    devSourcemap: false,
  },
  // Optimisations pour les dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'recharts',
    ],
    exclude: [],
    // Force le pré-bundling pour un chargement plus rapide
    force: true,
  },
  // Optimisations pour les assets
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.gif'],
})
