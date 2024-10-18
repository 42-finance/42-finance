/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { checker } from 'vite-plugin-checker'

export default defineConfig({
  base: '/',
  server: {
    port: 4010
  },
  plugins: [react(), checker({ typescript: true })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.tsx'],
    pool: 'forks'
  }
})
