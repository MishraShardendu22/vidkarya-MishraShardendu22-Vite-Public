import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem - standalone chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - standalone to avoid circular deps
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/database'],
          // UI libraries
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Icons
          'icons-vendor': ['react-icons'],
          // Analytics
          'analytics-vendor': ['@vercel/analytics', '@vercel/speed-insights', 'react-ga4'],
          // Editor
          'editor-vendor': ['@tinymce/tinymce-react'],
          // Redux
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux'],
          // Other utilities
          'utils-vendor': ['axios', 'framer-motion', 'dompurify', 'html-react-parser', 'react-toastify'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild'
  }
})
