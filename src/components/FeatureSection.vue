<template>
  <section
    class="section-feature"
    :class="layout === 'img-left' ? 'coffee-heaven' : 'jeans-coffee'"
    :id="id"
  >
    <div class="container">
      <!-- Image Left Layout -->
      <template v-if="layout === 'img-left'">
        <div class="feature-img-wrap fade-up" ref="imgEl">
          <img :src="imgSrc" :alt="imgAlt" />
        </div>
        <div class="feature-text fade-up" ref="textEl">
          <span class="section-label">{{ label }}</span>
          <h2>{{ title }}</h2>
          <p>{{ text }}</p>
          <a :href="linkHref" class="btn-view">{{ linkText }} <span>&rarr;</span></a>
        </div>
      </template>

      <!-- Image Right Layout -->
      <template v-else>
        <div class="feature-text fade-up" ref="textEl">
          <span class="section-label">{{ label }}</span>
          <h2 v-html="title"></h2>
          <p>{{ text }}</p>
          <a :href="linkHref" class="btn-view">{{ linkText }} <span>&rarr;</span></a>
        </div>
        <div class="feature-img-wrap fade-up" ref="imgEl">
          <img :src="imgSrc" :alt="imgAlt" />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  id: String,
  label: String,
  title: String,
  text: String,
  linkText: String,
  linkHref: String,
  imgSrc: String,
  imgAlt: String,
  layout: { type: String, default: 'img-left' },
})

const imgEl = ref(null)
const textEl = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  if (imgEl.value) observer.observe(imgEl.value)
  if (textEl.value) observer.observe(textEl.value)
})
</script>
