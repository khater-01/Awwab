<template>
  <section class="section-menu" id="menu">
    <div class="container">
      <!-- Section Header -->
      <div class="menu-header fade-up">
        <h2>منتجات العطارة والبن</h2>
        <p class="menu-subtitle">
          أجود أنواع التوابل المنقاة، الأعشاب الطبيعية، الزيوت المعصورة على البارد، والبن المحوج الطازج
        </p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="menu-filter-bar fade-up">
        <div class="menu-tabs" id="menuTabs">
          <button
            :class="{ active: activeTab === 'all' }"
            @click="setTab('all')"
          >
            كل المنتجات ({{ totalProductsCount }})
          </button>

          <button
            v-for="(label, cat) in categories"
            :key="cat"
            :class="{ active: activeTab === cat }"
            @click="setTab(cat)"
          >
            {{ label }} ({{ (menuData[cat] || []).length }})
          </button>
        </div>

        <!-- Quick In-section Search -->
        <div class="menu-quick-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="ابحث عن منتج، بهار، بن، أو زيت..."
          />
          <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">&times;</button>
        </div>
      </div>

      <p v-if="syncNote" class="sync-note">{{ syncNote }}</p>

      <!-- Loading State -->
      <div v-if="isLoading" class="cards-loading-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line line-sm"></div>
            <div class="skeleton-line line-lg"></div>
            <div class="skeleton-line line-md"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="menu-empty-state">
        <div class="empty-icon">🌿</div>
        <h3>لم نعثر على منتجات مطابقة لـ "{{ searchQuery }}"</h3>
        <p>يرجى تجربة كلمة بحث أخرى أو تصفح الأقسام المختلفة.</p>
        <button class="btn-reset-filter" @click="searchQuery = ''; activeTab = 'all'">
          عرض جميع المنتجات
        </button>
      </div>

      <!-- Large Products Grid -->
      <div v-else class="attara-cards-grid" id="menuGrid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.name + product.category"
          :product="product"
          :category-name="categories[product.category] || product.category"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import ProductCard from "./ProductCard.vue"
import { fetchLiveMenu, getInstantMenu } from "../services/sheetService.js"

const activeTab = ref("all")
const searchQuery = ref("")
const isLoading = ref(false) // مبنستخدمهاش للتحميل الأول: الصفحة بتترسم فورًا من الكاش/النسخة الاحتياطية
const syncNote = ref("")

// رسم فوري بدون نت: آخر نسخة محفوظة على الجهاز أو النسخة الاحتياطية
const instant = getInstantMenu()
const menuData = ref(instant.menu)
const categories = ref(instant.categories)

const totalProductsCount = computed(() => {
  let count = 0
  for (const list of Object.values(menuData.value)) {
    count += (list || []).length
  }
  return count
})

// تصفية المنتجات حسب القسم والبحث
const filteredProducts = computed(() => {
  let list = []

  if (activeTab.value === "all") {
    for (const [catKey, items] of Object.entries(menuData.value)) {
      items.forEach((item) => list.push({ ...item, category: item.category || catKey }))
    }
  } else {
    const items = menuData.value[activeTab.value] || []
    list = items.map((item) => ({ ...item, category: item.category || activeTab.value }))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((p) => {
      const matchName = p.name && p.name.toLowerCase().includes(q)
      const matchDesc = p.desc && p.desc.toLowerCase().includes(q)
      const matchUnit = p.unit && p.unit.toLowerCase().includes(q)
      return matchName || matchDesc || matchUnit
    })
  }

  return list
})

function setTab(cat) {
  activeTab.value = cat
}

// تحديث الأسعار من الشيت في الخلفية — الزبون مبيستناش
async function loadProducts(forceRefresh = false) {
  try {
    const res = await fetchLiveMenu(forceRefresh)
    menuData.value = res.menu
    categories.value = res.categories
    // لو القسم المختار اتشال من الشيت نرجع لـ "كل المنتجات"
    if (activeTab.value !== "all" && !res.menu[activeTab.value]) activeTab.value = "all"
    syncNote.value = res.error ? "تعذّر تحديث الأسعار حاليًا — بنعرض آخر أسعار محفوظة." : ""
  } catch (err) {
    console.error("Failed to load products:", err)
  }
}

function onSwitchTab(e) {
  if (e.detail) {
    activeTab.value = e.detail
    const menuSection = document.getElementById("menu")
    if (menuSection) menuSection.scrollIntoView({ behavior: "smooth" })
  }
}

onMounted(() => {
  loadProducts(false)
  window.addEventListener("brunee:switch-tab", onSwitchTab)
})
onUnmounted(() => window.removeEventListener("brunee:switch-tab", onSwitchTab))
</script>

<style scoped>
.section-menu {
  background: var(--cream, #F5F0E1);
  padding: 80px 0 110px;
  direction: rtl;
}

.menu-header {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 36px;
}

.menu-badge {
  display: inline-block;
  background: rgba(200, 169, 126, 0.2);
  color: var(--green, #1A3C34);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.menu-header h2 {
  font-family: "Amiri", Georgia, serif;
  font-size: 2.8rem;
  color: var(--green, #1A3C34);
  margin-bottom: 12px;
  font-weight: 700;
}

.menu-subtitle {
  color: var(--text-muted, #5A7A6E);
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 24px;
}

/* Sheet Sync Bar */
.sheet-sync-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: var(--cream-light, #FAF7EE);
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid rgba(26, 60, 52, 0.1);
  box-shadow: 0 4px 16px rgba(26, 60, 52, 0.04);
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--green, #1A3C34);
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d4a843;
}

.status-dot.live {
  background: #25d366;
  box-shadow: 0 0 10px #25d366;
}

.update-time {
  font-size: 0.78rem;
  color: var(--text-muted, #5A7A6E);
}

.sync-actions {
  display: flex;
  gap: 10px;
}

.btn-sync-refresh, .btn-sync-settings {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid rgba(26, 60, 52, 0.15);
  color: var(--green, #1A3C34);
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-sync-refresh:hover, .btn-sync-settings:hover {
  background: rgba(26, 60, 52, 0.08);
  border-color: var(--accent, #C8A97E);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Filter Bar & Tabs */
.menu-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.menu-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px;
  background: var(--cream-dark, #E8DFC8);
  border-radius: 40px;
  max-width: fit-content;
  margin: 0 auto;
}

.menu-tabs button {
  background: none;
  color: var(--text-muted, #5A7A6E);
  font-size: 0.88rem;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 30px;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-tabs button.active {
  background: var(--green, #1A3C34);
  color: #FAF7EE;
  box-shadow: 0 4px 14px rgba(26, 60, 52, 0.25);
}

.menu-tabs button:hover:not(.active) {
  background: rgba(26, 60, 52, 0.08);
  color: var(--green, #1A3C34);
}

/* Quick Search */
.menu-quick-search {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
}

.menu-quick-search svg {
  position: absolute;
  right: 16px;
  color: var(--text-muted, #5A7A6E);
  pointer-events: none;
}

.menu-quick-search input {
  width: 100%;
  padding: 12px 46px 12px 36px;
  border-radius: 30px;
  border: 1.5px solid rgba(26, 60, 52, 0.12);
  background: var(--cream-light, #FAF7EE);
  color: var(--green, #1A3C34);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(26, 60, 52, 0.04);
}

.menu-quick-search input:focus {
  border-color: var(--accent, #C8A97E);
  box-shadow: 0 6px 20px rgba(200, 169, 126, 0.25);
}

.clear-search {
  position: absolute;
  left: 14px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: var(--text-muted, #5A7A6E);
  cursor: pointer;
  padding: 2px 6px;
}

/* Large Products Grid */
.attara-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 28px;
  padding: 10px 0;
}

/* Empty State */
.menu-empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--cream-light, #FAF7EE);
  border-radius: 24px;
  border: 1.5px dashed rgba(26, 60, 52, 0.15);
  margin: 20px 0;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.menu-empty-state h3 {
  font-family: "Amiri", Georgia, serif;
  font-size: 1.6rem;
  color: var(--green, #1A3C34);
  margin-bottom: 8px;
}

.menu-empty-state p {
  color: var(--text-muted, #5A7A6E);
  margin-bottom: 20px;
}

.btn-reset-filter {
  background: var(--green, #1A3C34);
  color: #FAF7EE;
  padding: 10px 24px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.btn-reset-filter:hover {
  background: var(--green-light, #2A5A4E);
  transform: translateY(-2px);
}

/* Skeleton Loading */
.cards-loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 28px;
}

.skeleton-card {
  background: var(--cream-light, #FAF7EE);
  border-radius: 20px;
  overflow: hidden;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.skeleton-img {
  height: 230px;
  background: linear-gradient(90deg, #e8dfc8 25%, #f5f0e1 50%, #e8dfc8 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}

.skeleton-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.skeleton-line {
  background: #e8dfc8;
  border-radius: 6px;
  height: 16px;
}

.line-sm {
  width: 40%;
}
.line-lg {
  width: 80%;
  height: 22px;
}
.line-md {
  width: 60%;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Dark Mode */
[data-theme="dark"] .section-menu {
  background: var(--cream, #1A1E1C);
}

[data-theme="dark"] .menu-header h2 {
  color: #E8E0D0;
}

[data-theme="dark"] .menu-badge {
  background: rgba(212, 184, 150, 0.15);
  color: #D4B896;
}

[data-theme="dark"] .sheet-sync-bar {
  background: #1E2422;
  border-color: rgba(232, 224, 208, 0.08);
}

[data-theme="dark"] .sync-status {
  color: #E8E0D0;
}

[data-theme="dark"] .btn-sync-refresh,
[data-theme="dark"] .btn-sync-settings {
  border-color: rgba(232, 224, 208, 0.15);
  color: #E8E0D0;
}

[data-theme="dark"] .menu-tabs {
  background: #141816;
}

[data-theme="dark"] .menu-tabs button.active {
  background: #1A3C34;
  color: #E8E0D0;
}

[data-theme="dark"] .menu-quick-search input {
  background: #1E2422;
  color: #E8E0D0;
  border-color: rgba(232, 224, 208, 0.1);
}

[data-theme="dark"] .menu-empty-state {
  background: #1E2422;
  border-color: rgba(232, 224, 208, 0.1);
}

[data-theme="dark"] .menu-empty-state h3 {
  color: #E8E0D0;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-header h2 {
    font-size: 2.1rem;
  }
  .sheet-sync-bar {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .sync-status {
    justify-content: center;
  }
  .sync-actions {
    justify-content: center;
  }
  .menu-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    max-width: 100%;
    justify-content: flex-start;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .menu-tabs::-webkit-scrollbar {
    display: none;
  }
  .menu-tabs button {
    flex-shrink: 0;
    padding: 8px 14px;
    font-size: 0.8rem;
  }
  .attara-cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
    .menu-quick-search input {
    font-size: 16px !important;
    }
}

.sync-note {
  text-align: center;
  color: var(--text-muted, #5A7A6E);
  font-size: 0.85rem;
  margin: -16px auto 20px;
}
</style>
