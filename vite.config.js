import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],
  server: {
    host: true,
    port: 80,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
})
