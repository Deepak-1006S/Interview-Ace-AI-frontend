import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
  '/api/v1': {
    target: 'http://localhost:5000',  // ← must be 5000
    changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',  // ← must be 5000
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/recharts')) return 'charts';
            if (id.includes('node_modules/socket.io-client')) return 'socket';
            if (id.match(/node_modules\/(react|react-dom|react-router-dom)(\/|$)/)) return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
