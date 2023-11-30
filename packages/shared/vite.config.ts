import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@/*': './src/*',
  //   },
  // },
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'config/vite.config.ts'),
      formats: ['es'],
      fileName: () => 'config/vite.config.js',
    },
  },
})
