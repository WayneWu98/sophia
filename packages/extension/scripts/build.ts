import { defineConfig, build } from 'vite'
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

build(
  defineConfig({
    build: { lib: { entry: 'src/background.ts', formats: ['cjs'], fileName: 'background' }, emptyOutDir: false },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  })
)
build(
  defineConfig({
    build: {
      lib: { entry: 'src/content.ts', formats: ['cjs'], fileName: 'content' },
      emptyOutDir: false,
      rollupOptions: { output: { manualChunks: () => 'content' } },
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  })
)
build(
  defineConfig({
    plugins: [react(), UnoCSS()],
    build: {
      lib: { entry: 'src/inject.tsx', formats: ['cjs'], fileName: 'inject' },
      emptyOutDir: false,
      rollupOptions: {
        output: {
          manualChunks: () => 'content',
          assetFileNames: 'inject.[ext]',
        },
      },
    },
    define: {
      'process.env': process.env,
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  })
)
