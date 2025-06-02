import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    exclude: ['altan-auth'], // Exclude altan-auth from optimization
  },
  build: {
    rollupOptions: {
      external: ['altan-auth'], // Exclude altan-auth from build
    },
  },
})