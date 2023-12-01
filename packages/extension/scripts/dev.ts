import { defineConfig } from 'vite'
import nodemon from 'nodemon'

nodemon({ exec: 'pnpm run build:background', watch: ['src'], ext: 'ts' })
