import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-plugin-prerender'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    prerender({
      // The path to your compiled app (standard is 'dist')
      staticDir: path.join(__dirname, 'dist'),
      // List the routes you want to turn into static HTML for SEO
      routes: ['/', '/listings', '/about', '/contact'],
      // Optional: Minify the resulting HTML
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
      },
    }),
  ],
})