import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FIX 2 & 3: Removed vite-plugin-prerender (incompatible with Vercel).
// Vercel handles SPA routing automatically via vercel.json rewrites.
// If you need SSG/prerendering on Vercel, use vike (already in your dependencies).

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    // Ensure proper static output for Vercel
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Better chunk splitting for production
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
