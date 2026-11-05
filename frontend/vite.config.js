import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Shoply frontend dev server — ports/proxy per docs/DEVELOPMENT_SETUP.md §4.2 and §9
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Same-origin dev transport: browser calls /api/* on :5173, Vite forwards to the API (§10.2)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
