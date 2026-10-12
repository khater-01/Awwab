<template>
  <div class="attara-card" :class="{ 'out-of-stock': !product.available }">
    <!-- Image Wrap -->
    <div class="card-img-wrap">
      <img
        :src="product.img"
        :alt="product.name"
        loading="lazy"
        class="card-img"
        @error="handleImgError"
      />
      <div class="card-gradient-overlay"></div>

      <!-- Badges -->
      <div class="card-badges">
        <span v-if="product.badge" class="badge-tag" :class="getBadgeClass(product.badge)">
          {{ product.badge }}
        </span>
        <span v-if="categoryName" class="badge-category">
          {{ categoryName }}
        </span>
      </div>

      <!-- Out of Stock Indicator -->
      <div v-if="!product.available" class="out-of-stock-overlay">
        <span>غير متوفر حالياً</span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <!-- Unit & Weight -->
      <div class="card-meta">
        <span class="meta-unit" v-if="product.unit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          {{ product.unit }}
        </span>
        <span class="meta-origin">🌿 طبيعي 100%</span>
      </div>

      <!-- Product Title -->
      <h3 class="card-title" :title="product.name">
        {{ product.name }}
      </h3>

      <!-- Description -->
      <p class="card-desc" v-if="product.desc">
        {{ product.desc }}
      </p>

      <!-- Footer: Price & WhatsApp Action -->
      <div class="card-footer">
        <div class="card-price-wrap">
          <span class="price-val">{{ product.price }}</span>
          <span class="price-curr">ج.م</span>
        </div>
        <div class="card-actions">
          <button
            class="btn-add-cart"
            @click="handleAddToCart"
            :disabled="!product.available"
            title="إضافة المنتج إلى سلة المشتريات"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>{{ inCartQty > 0 ? `في السلة (${inCartQty}) +` : 'أضف للسلة' }}</span>
          </button>

          <a
            :href="whatsappOrderUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-order-wa-quick"
            :class="{ disabled: !product.available }"
            :title="'طلب فوري لـ ' + product.name + ' عبر واتساب'"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.7C8.02 10.92 8.91 12.1 9.03 12.26C9.15 12.42 10.74 14.89 13.21 15.94C15.19 16.78 15.6 16.61 16.03 16.57C16.45 16.53 17.39 16.02 17.58 15.48C17.78 14.94 17.78 14.48 17.72 14.38C17.65 14.28 17.5 14.22 17.27 14.1C17.04 13.99 15.93 13.44 15.72 13.37C15.52 13.29 15.37 13.25 15.22 13.48C15.07 13.72 14.63 14.23 14.5 14.38C14.37 14.53 14.24 14.55 14.02 14.44C13.79 14.32 13.06 14.08 12.19 13.3C11.51 12.69 11.04 11.94 10.91 11.71C10.79 11.48 10.9 11.36 11.01 11.24C11.11 11.14 11.24 10.97 11.36 10.83C11.47 10.68 11.51 10.58 11.59 10.42C11.66 10.26 11.62 10.12 11.57 10.02C11.51 9.92 11.06 8.82 10.87 8.37C10.69 7.92 10.5 7.98 10.36 7.98C10.22 7.97 10.06 7.97 9.89 7.97C9.72 7.97 9.45 7.85 9.53 7.34Z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { SHEET_CONFIG } from "../config/sheetConfig.js"
import { useCart } from "../composables/useCart.js"

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  categoryName: {
    type: String,
    default: "",
  },
})

const { cartItems, addToCart } = useCart()

const inCartQty = computed(() => {
  const item = cartItems.value.find((i) => i.name === props.product.name)
  return item ? item.qty : 0
})

function handleAddToCart() {
  addToCart(props.product, 1)
}

// التعامل مع أي خطأ في تحميل صورة مخصصة بالرجوع لصورة العطارة
function handleImgError(e) {
  e.target.src = SHEET_CONFIG.defaultCategoryImages.default
}

function getBadgeClass(badge) {
  if (badge.includes("أكثر") || badge.includes("مبيعاً") || badge.includes("ملكي")) {
    return "badge-gold"
  }
  if (badge.includes("طبيعي") || badge.includes("بلدي") || badge.includes("فاخر")) {
    return "badge-green"
  }
  return "badge-default"
}

// رابط الطلب المباشر عبر واتساب مع رسالة جاهزة وواضحة
const whatsappOrderUrl = computed(() => {
  const phone = SHEET_CONFIG.whatsappNumber || "201009569606"
  const unitText = props.product.unit ? ` (${props.product.unit})` : ""
  const message = `السلام عليكم ورحمة الله،\nأريد طلب: ${props.product.name}${unitText}\nالسعر: ${props.product.price} ج.م\nمن محل عطارة وبن أوّاب.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
})
</script>

<style scoped>
.attara-card {
  background: var(--cream-light, #FAF7EE);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(26, 60, 52, 0.08);
  border: 1.5px solid rgba(26, 60, 52, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  text-align: right;
  direction: rtl;
}

.attara-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(26, 60, 52, 0.16);
  border-color: var(--accent, #C8A97E);
}

/* Image Wrap */
.card-img-wrap {
  position: relative;
  width: 100%;
  height: 230px;
  overflow: hidden;
  background: #1a3c3410;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: block;
}

.attara-card:hover .card-img {
  transform: scale(1.08);
}

.card-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(15, 40, 32, 0.6) 0%, transparent 100%);
  pointer-events: none;
}

/* Badges */
.card-badges {
  position: absolute;
  top: 14px;
  right: 14px;
  left: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  z-index: 2;
  pointer-events: none;
}

.badge-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.2px;
}

.badge-gold {
  background: #d4a843e6;
  color: #1a1e1c;
}

.badge-green {
  background: #1a3c34e6;
  color: #f5f0e1;
}

.badge-default {
  background: #c8a97ee6;
  color: #0f2820;
}

.badge-category {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  color: var(--green, #1A3C34);
  backdrop-filter: blur(6px);
}

.out-of-stock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 40, 32, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  backdrop-filter: blur(4px);
}

/* Card Body */
.card-body {
  padding: 20px 22px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: var(--text-muted, #5A7A6E);
}

.meta-unit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(26, 60, 52, 0.06);
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--green, #1A3C34);
}

.meta-origin {
  font-size: 0.75rem;
  font-weight: 600;
  color: #2a5a4e;
}

.card-title {
  font-family: "Amiri", "Playfair Display", Georgia, serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--green, #1A3C34);
  line-height: 1.35;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}

.card-desc {
  font-size: 0.88rem;
  color: var(--text-muted, #5A7A6E);
  line-height: 1.6;
  margin-bottom: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

/* Footer: Price & WhatsApp */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(26, 60, 52, 0.08);
  gap: 12px;
}

.card-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-val {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--green, #1A3C34);
  letter-spacing: -0.5px;
}

.price-curr {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-dark, #A8895E);
}

/* Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add-cart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--green, #1A3C34);
  color: #FAF7EE;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(26, 60, 52, 0.2);
}

.btn-add-cart:hover:not(:disabled) {
  background: var(--accent, #C8A97E);
  color: #0F2820;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 169, 126, 0.35);
}

.btn-add-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-order-wa-quick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #25D366;
  color: #ffffff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
  flex-shrink: 0;
}

.btn-order-wa-quick:hover {
  background: #20BA5A;
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.45);
}

.btn-order-wa-quick.disabled {
  background: #ccc;
  pointer-events: none;
  box-shadow: none;
}

/* Dark Mode Support */
[data-theme="dark"] .attara-card {
  background: #1E2422;
  border-color: rgba(232, 224, 208, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .attara-card:hover {
  border-color: var(--accent, #D4B896);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

[data-theme="dark"] .card-title {
  color: #E8E0D0;
}

[data-theme="dark"] .card-desc {
  color: #8A9E96;
}

[data-theme="dark"] .meta-unit {
  background: rgba(232, 224, 208, 0.08);
  color: #D4B896;
}

[data-theme="dark"] .meta-origin {
  color: #A8895E;
}

[data-theme="dark"] .price-val {
  color: #E0B85A;
}

[data-theme="dark"] .card-footer {
  border-top-color: rgba(232, 224, 208, 0.08);
}

[data-theme="dark"] .badge-category {
  background: rgba(30, 36, 34, 0.9);
  color: #E8E0D0;
}
</style>
