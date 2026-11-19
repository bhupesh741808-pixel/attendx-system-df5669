import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The React app lives in /frontend; the build output goes to /dist at the repo root
// so Netlify can publish it (and later serve the Express API from netlify/server).
export default defineConfig({
  root: 'frontend',
  plugins: [react(), tailwindcss()],
  build: { outDir: '../dist', emptyOutDir: true },
})
