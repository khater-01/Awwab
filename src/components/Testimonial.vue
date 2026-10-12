<template>
  <section class="section-testimonial" id="testimonial" dir="rtl">
    <div class="container">
      <h2 class="fade-up" ref="titleEl">آراء وتجارب عملائنا</h2>

      <div class="testimonial-carousel">
        <button class="carousel-arrow right" id="testPrev" aria-label="الرأي السابق" @click="prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <Transition name="testimonial-fade" mode="out-in">
          <div class="testimonial-card fade-up visible" :key="current">
            <div class="testimonial-stars">
              <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <blockquote>{{ testimonials[current].text }}</blockquote>
            <div class="reviewer">{{ testimonials[current].name }}</div>
            <div class="reviewer-tag">{{ testimonials[current].tag }}</div>
          </div>
        </Transition>

        <button class="carousel-arrow left" id="testNext" aria-label="الرأي التالي" @click="next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const testimonials = [
  {
    name: 'أ/ محمود الشامي',
    tag: 'زبون دائم - الحي الثامن',
    text: '"البن المحوج دبل هيل بتاع أواب حكاية لوحده! التحميصة ونسبة الحبهان والمستكة مضبوطة على الملي، وريحة البن بتملى المكان. جودة لا يعلى عليها."',
  },
  {
    name: 'أم عبد الرحمن',
    tag: 'مدينة العبور',
    text: '"التوابل عندهم حاجة تشرف، منقى ومطحونة طازة ونظيفة جداً مفيهاش أي شوائب. وخلطة بهارات اللحم والفراخ بتخلي ريحة وطعم الأكل مختلفة تماماً."',
  },
  {
    name: 'د. أحمد ممدوح',
    tag: 'طبيب باطنة وتغذية',
    text: '"زيت الزيتون السيناوي المعصور ع البارد وعسل السدر الجبلي نقي ومفحوص، والشفافية في الأسعار وتحديثها المستمر يخليك تشتري وأنت مطمن 100%."',
  },
]

const current = ref(0)
const titleEl = ref(null)

function next() {
  current.value = (current.value + 1) % testimonials.length
}
function prev() {
  current.value = (current.value - 1 + testimonials.length) % testimonials.length
}

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
  if (titleEl.value) observer.observe(titleEl.value)
})
</script>

<style scoped>
.reviewer-tag {
  font-size: 0.8rem;
  color: var(--accent, #C8A97E);
  margin-top: 4px;
}
.testimonial-fade-enter-active,
.testimonial-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.testimonial-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.testimonial-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
