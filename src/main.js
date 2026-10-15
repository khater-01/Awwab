import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'

// شاشة التحميل بتتشال أول ما الصفحة تترسم، وحتى لو حصل خطأ (try/finally)
function hideLoader() {
  if (window.__hideLoader) return window.__hideLoader()
  const loader = document.getElementById('app-loader')
  if (loader) loader.remove()
}

try {
  createApp(App).mount('#app')
} catch (err) {
  console.error('App failed to mount:', err)
} finally {
  // نستنى frame واحد عشان الصفحة تترسم قبل ما نشيل الشاشة
  requestAnimationFrame(hideLoader)
}
