import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/api-vn': {
        target: 'https://provinces.open-api.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-vn/, ''),
      },
    },
  },
  define: {
    global: 'window', //để {} sẽ bị lỗi 2000
  },
})