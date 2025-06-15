import { defineConfig } from 'vite'

export default defineConfig({
  base: '/my-tutor-app-live/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'home.html'
      }
    }
  }
})
