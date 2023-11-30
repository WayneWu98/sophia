/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

const DEV = process.env.NODE_ENV === 'development'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [react(), dts()],
  build: {
    sourcemap: DEV ? false : 'inline',
    lib: {
      name: 'DomAnchor',
      entry: 'src/dom-anchor.ts',
      formats: ['es', 'cjs', 'iife', 'umd'],
      fileName: 'index',
    },
  },
  server: {
    host: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})
