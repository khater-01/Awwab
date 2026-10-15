<template>
  <section v-if="bestSellers.length" class="section-bestselling" id="bestselling">
    <div class="container">
      <div class="bestselling-head fade-up">
        <span class="head-tag">⭐ الأكثر طلباً في خان العمار</span>
        <h2>أصناف العطارة والبن الأكثر مبيعاً</h2>
        <p class="section-sub">
          المنتجات المفضلة لدى زبائننا الكرام لجودتها الفائقة وطعمها الطبيعي الأصيل
        </p>
      </div>

      <div class="bestselling-grid">
        <ProductCard
          v-for="item in bestSellers"
          :key="item.name"
          :product="item"
          :category-name="item.catName"
        />
      </div>

      <div class="bestselling-cta fade-up">
        <a href="#menu" class="btn-view-all">
          <span>تصفح جميع منتجات العطارة والبن</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import ProductCard from "./ProductCard.vue"
import { fetchLiveMenu, getInstantMenu } from "../services/sheetService.js"

// الأكثر مبيعًا بتيجي من عمود "الأكثر مبيعا" في الشيت (اكتب فيه: نعم).
// لو مفيش أي منتج متعلّم، القسم ده بيتخفي بدل ما يعرض منتجات وهمية.
const bestSellers = ref([])

function pickFeatured(res) {
  const featured = []
  for (const [catKey, items] of Object.entries(res.menu)) {
    items.forEach((item) => {
      if (item.isBestSeller && item.available) {
        featured.push({ ...item, catName: res.categories[catKey] || catKey })
      }
    }
    )
  }
  return featured.slice(0, 3)
}

bestSellers.value = pickFeatured(getInstantMenu())

onMounted(async () => {
  try {
    bestSellers.value = pickFeatured(await fetchLiveMenu(false))
  } catch (e) {
    console.warn("Could not load dynamic best sellers:", e)
  }
})
</script>

<style scoped>
.section-bestselling {
  background: var(--cream-light, #FAF7EE);
  padding: 85px 0 100px;
  text-align: center;
  direction: rtl;
}

.bestselling-head {
  max-width: 700px;
  margin: 0 auto 44px;
}

.head-tag {
  display: inline-block;
  background: rgba(212, 168, 67, 0.2);
  color: var(--gold, #D4A843);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.bestselling-head h2 {
  font-family: "Amiri", Georgia, serif;
  font-size: 2.6rem;
  color: var(--green, #1A3C34);
  margin-bottom: 12px;
  font-weight: 700;
}

.section-sub {
  color: var(--text-muted, #5A7A6E);
  font-size: 1.05rem;
  line-height: 1.6;
}

.bestselling-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 48px;
}

.bestselling-cta {
  display: flex;
  justify-content: center;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--green, #1A3C34);
  color: #FAF7EE;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(26, 60, 52, 0.2);
}

.btn-view-all:hover {
  background: var(--accent, #C8A97E);
  color: #0F2820;
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(200, 169, 126, 0.4);
}

[data-theme="dark"] .section-bestselling {
  background: #141816;
}

[data-theme="dark"] .bestselling-head h2 {
  color: #E8E0D0;
}

[data-theme="dark"] .btn-view-all {
  background: var(--accent, #D4B896);
  color: #080F0C;
}

@media (max-width: 1024px) {
  .bestselling-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .bestselling-head h2 {
    font-size: 2rem;
  }
  .bestselling-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
