import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // alias @ trỏ về thư mục src
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174, 
  },
})
