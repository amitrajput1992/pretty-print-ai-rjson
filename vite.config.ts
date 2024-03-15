import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  //  https://vitejs.dev/guide/static-deploy#github-pages
  base: "/pretty-print-ai-rjson/"
})
