import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      '@app': path.resolve(__dirname, './src/app'),

      '@components': path.resolve(__dirname, './src/components'),

      '@features': path.resolve(__dirname, './src/features'),

      '@layouts': path.resolve(__dirname, './src/layouts'),

      '@pages': path.resolve(__dirname, './src/pages'),

      '@services': path.resolve(__dirname, './src/services'),

      '@hooks': path.resolve(__dirname, './src/hooks'),

      '@utils': path.resolve(__dirname, './src/utils'),

      '@styles': path.resolve(__dirname, './src/styles'),

      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
})