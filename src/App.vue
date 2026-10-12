<template>
  <div :data-theme="isDark ? 'dark' : ''">
    <NavBar
      :is-dark="isDark"
      @toggle-dark="toggleDark"
      @open-search="isSearchOpen = true"
    />

    <main>
      <HeroSection />
      <FeatureSection
        id="coffee-heaven"
        label="أصالتنا وجودتنا"
        title="أسرار التوابل والأعشاب الطبيعية"
        text="في عطارة وبن أوّاب، ننتقي التوابل والأعشاب من مواطنها الأصلية مباشرة. ننقيها يدوياً ونطحنها طازجة على البارد لنحافظ على زيوتها العطرية وفوائدها الصحية ونكهتها الزكية التي تضفي على كل وجبة طابعاً ساحراً."
        link-text="استكشف التوابل والبهارات"
        link-href="#menu"
        img-src="/images/attara_spices.png"
        img-alt="توابل وبهارات طازجة في عطارة أواب"
        layout="img-left"
      />
      <FeatureSection
        id="jeans-coffee"
        label="توليفات خاصة ومشروبات"
        title="أصالة البن المحوج والزيوت النقية"
        text="توليفات بن فاخرة تجمع بين البن البرازيلي والكولومبي مع الحبهان الأخضر والمستكة والخلطات الملكية. بالإضافة إلى الزيوت الطبيعية المعصورة على البارد والعسل النقي ومنتجات السرجة البلدية المضمونة 100%."
        link-text="تصفح أصناف البن والزيوت"
        link-href="#menu"
        img-src="/images/attara_coffee.png"
        img-alt="بن محوج وزيوت طبيعية في عطارة أواب"
        layout="img-right"
      />
      <MenuSection />
      <BestSelling />
      <Testimonial />
    </main>
    <Contact />
    <FooterSection />

    <SearchPanel :is-open="isSearchOpen" @close="isSearchOpen = false" />
    <CartDrawer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from "vue"
import NavBar from "./components/NavBar.vue"
import HeroSection from "./components/HeroSection.vue"
import FeatureSection from "./components/FeatureSection.vue"
import MenuSection from "./components/MenuSection.vue"
import BestSelling from "./components/BestSelling.vue"
import Testimonial from "./components/Testimonial.vue"
import FooterSection from "./components/FooterSection.vue"
import SearchPanel from "./components/SearchPanel.vue"
import Contact from "./components/Contact.vue"
import CartDrawer from "./components/CartDrawer.vue"

const isDark = ref(false)
const isSearchOpen = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem("brunee-theme", isDark.value ? "dark" : "light")
}

onMounted(() => {
  if (localStorage.getItem("brunee-theme") === "dark") {
    isDark.value = true
  }

  // Global fade-up IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible")
          observer.unobserve(e.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el))

  // Ctrl+K global shortcut
  function onKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      isSearchOpen.value = !isSearchOpen.value
    }
  }
  window.addEventListener("keydown", onKeydown)
  onUnmounted(() => window.removeEventListener("keydown", onKeydown))
})

// Provide search state to all child components
provide("openSearch", () => {
  isSearchOpen.value = true
})
provide("closeSearch", () => {
  isSearchOpen.value = false
})
provide("isSearchOpen", isSearchOpen)
</script>
