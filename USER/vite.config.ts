import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  esbuild: {
    // Xoa toan bo console.*/debugger khoi build production, tranh lo token/du lieu
    // qua DevTools console (xem Code Review FE USER). Van giu nguyen khi chay `vite dev`.
    drop: command === 'build' ? ['console', 'debugger'] : [],
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
}))
