import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 🔑 GitHub Pages: the site is served from /Awwab/ not /
  base: '/Awwab/',
  plugins: [vue()],
  build: {
    // Split vendor (Vue) into a separate chunk for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
})
