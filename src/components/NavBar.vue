<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }" id="navbar">
    <div class="container">
      <a href="#hero" class="nav-logo">
        <span style="font-weight: 400; font-style: normal; font-size: 35px">
          عطَارَه وبُن أَوَّابٍ</span
        >
      </a>

      <ul class="nav-links" :class="{ open: mobileOpen }" id="navLinks">
        <li>
          <a
            href="#hero"
            :class="{ active: activeSection === 'hero' }"
            @click="closeMobile"
            >الرئيــســيه</a
          >
        </li>
        <li>
          <a
            href="#menu"
            :class="{ active: activeSection === 'menu' }"
            @click="closeMobile"
            >المنتجــات</a
          >
        </li>
        <li>
          <a
            href="#coffee-heaven"
            :class="{ active: activeSection === 'coffee-heaven' }"
            @click="closeMobile"
            >من نحــن</a
          >
        </li>
        <li>
          <a
            href="#bestselling"
            :class="{ active: activeSection === 'bestselling' }"
            @click="closeMobile"
            >الأكثر مبيعاً</a
          >
        </li>
        <li>
          <a
            href="#contact"
            :class="{ active: activeSection === 'contact' }"
            @click="closeMobile"
            >تواصـــل مــعـنا</a
          >
        </li>
      </ul>

      <div class="nav-right">
        <!-- Search Button -->
        <button
          class="search-btn"
          id="searchToggle"
          aria-label="Search menu"
          @click="$emit('open-search')"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <!-- Cart Button -->
        <button
          class="nav-cart-btn"
          id="navCartToggle"
          aria-label="سلة المشتريات"
          @click="openCart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span v-if="itemCount > 0" class="nav-cart-badge">{{ itemCount }}</span>
        </button>

        <!-- Dark Mode Toggle -->
        <button
          class="darkmode-btn"
          id="darkModeToggle"
          aria-label="Toggle dark mode"
          @click="$emit('toggle-dark')"
        >
          <svg
            v-if="!isDark"
            class="icon-moon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg
            v-else
            class="icon-sun"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        <!-- Hamburger -->
        <button
          class="hamburger"
          id="hamburger"
          aria-label="Toggle menu"
          @click="toggleMobile"
        >
          <span
            :style="
              mobileOpen ? 'transform:rotate(45deg) translate(5px,5px)' : ''
            "
          ></span>
          <span :style="mobileOpen ? 'opacity:0' : ''"></span>
          <span
            :style="
              mobileOpen ? 'transform:rotate(-45deg) translate(5px,-5px)' : ''
            "
          ></span>
        </button>
      </div>
    </div>
  </nav>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");
.nav-logo {
  font-family: "Aref Ruqaa", serif;
  font-weight: 700;
}
.nav-cart-btn {
  position: relative;
  background: none;
  border: none;
  color: #f5f0e1b3;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.3s, background 0.3s;
}
.nav-cart-btn:hover {
  color: var(--cream, #f5f0e1);
  background: rgba(245, 240, 225, 0.1);
}
.nav-cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #25d366;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  min-width: 17px;
  height: 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
</style>
<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useCart } from "../composables/useCart.js"

const { openCart, itemCount } = useCart()

const props = defineProps({
  isDark: Boolean,
})
defineEmits(["toggle-dark", "open-search"])

const isScrolled = ref(false)
const mobileOpen = ref(false)
const activeSection = ref("hero")

function onScroll() {
  isScrolled.value = window.scrollY > 60

  // Active section tracking
  const sections = document.querySelectorAll("section[id]")
  let current = ""
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute("id")
  })
  if (current) activeSection.value = current
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

// Close mobile menu on outside click
function handleOutsideClick(e) {
  if (mobileOpen.value && !e.target.closest(".navbar")) {
    mobileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll)
  document.addEventListener("click", handleOutsideClick)
})
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
  document.removeEventListener("click", handleOutsideClick)
})
</script>
