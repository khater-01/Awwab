<template>
  <!-- Overlay -->
  <Teleport to="body">
    <div class="search-overlay" :class="{ open: isOpen }" @click="$emit('close')"></div>

    <div class="search-panel" :class="{ open: isOpen }" id="searchPanel" dir="rtl">
      <div class="search-panel-header">
        <div class="search-input-wrap">
          <svg class="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="searchInput"
            v-model="query"
            placeholder="ابحث في منتجات العطارة، البن، والزيوت..."
            autocomplete="off"
            ref="inputRef"
          />
          <kbd class="search-kbd">ESC</kbd>
        </div>
        <button class="search-close" id="searchClose" @click="$emit('close')">&times;</button>
      </div>

      <div class="search-results" id="searchResults">
        <!-- Empty state -->
        <div v-if="!query.trim()" class="search-empty" id="searchEmpty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>اكتب اسم البهار، البن، الزيت أو العشبة للبحث الفوري</p>
        </div>

        <!-- No results -->
        <div v-else-if="groupedResults.length === 0" class="search-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>لم نعثر على نتائج لـ "<strong>{{ query }}</strong>"</p>
        </div>

        <!-- Results grouped by category -->
        <div
          v-for="group in groupedResults"
          :key="group.category"
          class="search-result-group"
        >
          <div class="search-result-category">{{ group.categoryName }}</div>
          <div
            v-for="(item, i) in group.items"
            :key="item.name"
            class="search-result-item"
            :style="{ animationDelay: i * 30 + 'ms' }"
            @click="navigateToCategory(group.category)"
          >
            <div class="search-result-left">
              <div class="search-result-icon">
                <img :src="item.img" :alt="item.name" class="search-item-thumb" />
              </div>
              <div>
                <div class="search-result-name" v-html="highlight(item.name)"></div>
                <div v-if="item.desc || item.unit" class="search-result-desc">
                  <span v-if="item.unit" class="search-unit">[{{ item.unit }}] </span>
                  <span v-html="highlight(item.desc || '')"></span>
                </div>
              </div>
            </div>
            <div class="search-result-price">{{ item.price }} ج.م</div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { SEARCH_INDEX, INITIAL_CATEGORIES } from '../data/menu.js'
import { fetchLiveMenu } from '../services/sheetService.js'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const query = ref('')
const inputRef = ref(null)
const liveIndex = ref(SEARCH_INDEX)
const currentCategories = ref(INITIAL_CATEGORIES)

watch(() => props.isOpen, async (val) => {
  if (val) {
    query.value = ''
    nextTick(() => inputRef.value?.focus())
    try {
      const res = await fetchLiveMenu(false)
      liveIndex.value = res.searchIndex
      currentCategories.value = res.categories
    } catch (e) {
      console.warn("Could not load live search index:", e)
    }
  }
})

function onKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) emit('close')
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (props.isOpen) emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

const groupedResults = computed(() => {
  const trimmed = query.value.trim().toLowerCase()
  if (!trimmed) return []

  const matches = liveIndex.value.filter(
    (item) =>
      item.name.toLowerCase().includes(trimmed) ||
      (item.desc && item.desc.toLowerCase().includes(trimmed)) ||
      (item.unit && item.unit.toLowerCase().includes(trimmed)) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(trimmed))
  )

  const grouped = {}
  matches.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  return Object.entries(grouped).map(([category, items]) => ({
    category,
    categoryName: currentCategories.value[category] || category,
    items,
  }))
})

function highlight(text) {
  if (!text || !query.value.trim()) return text
  const escaped = query.value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
}

function navigateToCategory(cat) {
  emit('close')
  setTimeout(() => {
    const menuSection = document.getElementById('menu')
    if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('brunee:switch-tab', { detail: cat }))
    }, 400)
  }, 100)
}
</script>

<style scoped>
.search-item-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
}
.search-unit {
  color: var(--accent, #C8A97E);
  font-weight: 600;
  margin-left: 4px;
}
</style>
