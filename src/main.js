import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// Hide loading spinner after Vue mounts
const loader = document.getElementById('app-loader')
if (loader) {
  loader.classList.add('fade-out')
  setTimeout(() => loader.remove(), 500)
}

