<template>
  <Teleport to="body">
    <!-- Floating Cart Button -->
    <button
      class="floating-cart-btn"
      :class="{ 'has-items': itemCount > 0 }"
      @click="openCart"
      aria-label="عرض سلة المشتريات"
    >
      <div class="cart-btn-icon-wrap">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path
            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          />
        </svg>
        <span v-if="itemCount > 0" class="cart-badge-count">{{
          itemCount
        }}</span>
      </div>
      <div class="cart-btn-text" v-if="itemCount > 0">
        <span class="cart-btn-label">السلة</span>
        <span class="cart-btn-total">{{ finalTotal }} ج.م</span>
      </div>
    </button>

    <!-- Global Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="toastMessage" class="cart-toast" dir="rtl">
        <span class="toast-icon">✨</span>
        <span class="toast-text">{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Drawer Overlay -->
    <div v-if="isCartOpen" class="cart-overlay" @click="closeCart"></div>

    <!-- Slide-over Drawer Panel -->
    <aside class="cart-drawer" :class="{ open: isCartOpen }" dir="rtl">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="drawer-title-wrap">
          <div class="cart-header-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path
                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
              />
            </svg>
          </div>
          <div>
            <h3>سلة المشتريات</h3>
            <span class="drawer-count">({{ itemCount }} أصناف)</span>
          </div>
        </div>

        <div class="drawer-actions-top">
          <button
            v-if="cartItems.length > 0"
            class="btn-clear-cart"
            @click="clearCart"
            title="إفراغ السلة"
          >
            مسح الكل
          </button>
          <button
            class="btn-close-drawer"
            @click="closeCart"
            aria-label="إغلاق السلة"
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Discount Progress Bar (500 EGP Threshold) -->
      <div class="discount-banner" :class="{ achieved: hasDiscount }">
        <div class="discount-info">
          <span v-if="!hasDiscount">
            أضف بـ <strong>{{ remainingForDiscount }} ج.م</strong> إضافية للحصول
            على <strong>خصم 10%</strong> على طلبك!
          </span>
          <span v-else class="achieved-text">
            🎉 مبروك! حصلت على
            <strong>خصم 10% (وفرت {{ discountAmount }} ج.م)</strong>!
          </span>
        </div>
        <div class="progress-bar-wrap">
          <div
            class="progress-fill"
            :style="{ width: discountProgress + '%' }"
            :class="{ full: hasDiscount }"
          ></div>
        </div>
      </div>

      <!-- Drawer Body: Items or Empty -->
      <div class="drawer-body">
        <!-- Empty State -->
        <div v-if="cartItems.length === 0" class="cart-empty-view">
          <div class="empty-cart-icon">🛒</div>
          <h4>السلة فارغة حالياً</h4>
          <p>تصفح منتجات العطارة والبن وأضف ما ترغب به لتصلك أينما كنت.</p>
          <button class="btn-browse-products" @click="closeCart">
            تصفح المنتجات الآن
          </button>
        </div>

        <!-- Cart Items List -->
        <div v-else class="cart-items-list">
          <div v-for="item in cartItems" :key="item.name" class="cart-item-row">
            <img :src="item.img" :alt="item.name" class="item-thumb" />

            <div class="item-details">
              <h4 class="item-name">{{ item.name }}</h4>
              <span v-if="item.unit" class="item-unit">{{ item.unit }}</span>
              <span class="item-price">{{ item.price }} ج.م للوحدة</span>
            </div>

            <div class="item-controls">
              <div class="qty-stepper">
                <button
                  @click="updateQty(item.name, item.qty - 1)"
                  aria-label="تقليل الكمية"
                >
                  -
                </button>
                <span class="qty-num">{{ item.qty }}</span>
                <button
                  @click="updateQty(item.name, item.qty + 1)"
                  aria-label="زيادة الكمية"
                >
                  +
                </button>
              </div>

              <div class="item-line-total">{{ item.price * item.qty }} ج.م</div>

              <button
                class="btn-remove-item"
                @click="removeFromCart(item.name)"
                title="حذف هذا الصنف"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Customer Delivery Form -->
          <div class="checkout-form-box">
            <h5>بيانات التوصيل (مطلوبة لتأكيد الطلب):</h5>

            <!-- حقل الاسم -->
            <div class="input-group">
              <input
                type="text"
                v-model="customer.name"
                placeholder="الاسم الكريم"
                class="cust-input"
                :class="{ 'input-error': errors.name }"
                @input="errors.name = ''"
              />
              <span v-if="errors.name" class="field-error-msg">{{
                errors.name
              }}</span>
            </div>

            <!-- حقل العنوان -->
            <div class="input-group">
              <input
                type="text"
                v-model="customer.address"
                placeholder="العنوان بالتفصيل"
                class="cust-input"
                :class="{ 'input-error': errors.address }"
                @input="errors.address = ''"
              />
              <span v-if="errors.address" class="field-error-msg">{{
                errors.address
              }}</span>
            </div>

            <!-- حقل الهاتف -->
            <div class="input-group">
              <input
                type="tel"
                v-model="customer.phone"
                placeholder="رقم الهاتف (11 رقم على الأقل)"
                class="cust-input"
                :class="{ 'input-error': errors.phone }"
                @input="errors.phone = ''"
              />
              <span v-if="errors.phone" class="field-error-msg">{{
                errors.phone
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div v-if="cartItems.length > 0" class="drawer-footer">
        <div class="totals-breakdown">
          <div class="total-row">
            <span>المجموع الفرعي:</span>
            <span>{{ subtotal }} ج.م</span>
          </div>

          <div v-if="hasDiscount" class="total-row discount-row">
            <span>خصم مشتريات أكثر من 500 ج ({{ discountRate }}%):</span>
            <span class="discount-val">-{{ discountAmount }} ج.م</span>
          </div>

          <div class="total-row final-row">
            <span>الإجمالي النهائي للدفع:</span>
            <span class="final-val">{{ finalTotal }} ج.م</span>
          </div>
        </div>

        <!-- WhatsApp Checkout Button -->
        <button @click="submitOrder" class="btn-checkout-wa">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.7C8.02 10.92 8.91 12.1 9.03 12.26C9.15 12.42 10.74 14.89 13.21 15.94C15.19 16.78 15.6 16.61 16.03 16.57C16.45 16.53 17.39 16.02 17.58 15.48C17.78 14.94 17.78 14.48 17.72 14.38C17.65 14.28 17.5 14.22 17.27 14.1C17.04 13.99 15.93 13.44 15.72 13.37C15.52 13.29 15.37 13.25 15.22 13.48C15.07 13.72 14.63 14.23 14.5 14.38C14.37 14.53 14.24 14.55 14.02 14.44C13.79 14.32 13.06 14.08 12.19 13.3C11.51 12.69 11.04 11.94 10.91 11.71C10.79 11.48 10.9 11.36 11.01 11.24C11.11 11.14 11.24 10.97 11.36 10.83C11.47 10.68 11.51 10.58 11.59 10.42C11.66 10.26 11.62 10.12 11.57 10.02C11.51 9.92 11.06 8.82 10.87 8.37C10.69 7.92 10.5 7.98 10.36 7.98C10.22 7.97 10.06 7.97 9.89 7.97C9.72 7.97 9.45 7.85 9.53 7.34Z"
            />
          </svg>
          <span>إرسال الطلب عبر واتساب</span>
        </button>
      </div>
    </aside>
  </Teleport>
</template>

<script setup>
import { reactive } from "vue"
import { useCart } from "../composables/useCart.js"

const {
  cartItems,
  isCartOpen,
  toastMessage,
  openCart,
  closeCart,
  clearCart,
  removeFromCart,
  updateQty,
  itemCount,
  subtotal,
  discountRate,
  hasDiscount,
  discountAmount,
  finalTotal,
  remainingForDiscount,
  discountProgress,
  getWhatsAppCheckoutUrl,
} = useCart()

const customer = reactive({
  name: "",
  address: "",
  phone: "",
})

const errors = reactive({
  name: "",
  address: "",
  phone: "",
})

function submitOrder() {
  // تصفير الأخطاء
  errors.name = ""
  errors.address = ""
  errors.phone = ""

  const cleanName = customer.name.trim()
  const cleanAddress = customer.address.trim()
  const cleanPhone = customer.phone.trim()

  let hasError = false

  if (!cleanName) {
    errors.name = "يرجى إدخال الاسم"
    hasError = true
  }

  if (!cleanAddress) {
    errors.address = "يرجى إدخال العنوان للتوصيل"
    hasError = true
  }

  if (!cleanPhone) {
    errors.phone = "يرجى إدخال رقم الهاتف للتواصل"
    hasError = true
  } else {
    const phoneRegex = /^[0-9]{11,}$/
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = "يجب ألا يقل رقم الهاتف عن 11 رقمًا"
      hasError = true
    }
  }

  if (hasError) return

  // إرسال البيانات لدالة الواتساب
  // تم دمج رقم الهاتف مع العنوان لضمان ظهوره في الرسالة بدون الحاجة لتعديل ملفات أخرى
  const url = getWhatsAppCheckoutUrl({
    name: cleanName,
    address: `${cleanAddress} - هاتف: ${cleanPhone}`,
  })

  window.open(url, "_blank")
}
</script>

<style scoped>
/* Floating Cart Button */
.floating-cart-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 990;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--green, #1a3c34);
  color: #faf7ee;
  padding: 14px 22px;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(26, 60, 52, 0.4);
  border: 2px solid var(--accent, #c8a97e);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  direction: rtl;
}

.floating-cart-btn:hover {
  transform: translateY(-4px) scale(1.03);
  background: var(--green-light, #2a5a4e);
  box-shadow: 0 14px 36px rgba(26, 60, 52, 0.55);
}

.cart-btn-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge-count {
  position: absolute;
  top: -10px;
  right: -12px;
  background: #e03131;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #1a3c34;
  animation: popIn 0.3s ease;
}

.cart-btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.cart-btn-label {
  font-size: 0.75rem;
  color: var(--accent, #c8a97e);
  font-weight: 600;
}

.cart-btn-total {
  font-size: 0.95rem;
  font-weight: 800;
}

/* Global Toast */
.cart-toast {
  position: fixed;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--green, #1a3c34);
  color: #faf7ee;
  padding: 12px 24px;
  border-radius: 30px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--accent, #c8a97e);
  z-index: 1050;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 0.92rem;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -15px);
}

/* Overlay */
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 40, 32, 0.65);
  backdrop-filter: blur(6px);
  z-index: 1000;
  transition: opacity 0.3s ease;
}

/* Slide-over Drawer */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 460px;
  max-width: 100vw; /* تم التعديل لملء الشاشة في الموبايل */
  height: 100vh;
  height: 100dvh; /* مهمة جداً لحل مشكلة شريط المتصفح في الموبايل */
  background: var(--cream-light, #FAF7EE);
  color: var(--green, #1A3C34);
  z-index: 1001;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.cart-drawer.open {
  transform: translateX(0);
}

/* Drawer Header */
.drawer-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(26, 60, 52, 0.08);
  background: rgba(26, 60, 52, 0.03);
}

.drawer-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(200, 169, 126, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--green, #1a3c34);
}

.drawer-title-wrap h3 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 800;
  color: var(--green, #1a3c34);
}

.drawer-count {
  font-size: 0.8rem;
  color: var(--text-muted, #5a7a6e);
}

.drawer-actions-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-clear-cart {
  background: none;
  border: none;
  color: #c92a2a;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
}

.btn-close-drawer {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--green, #1a3c34);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

/* Discount Banner */
.discount-banner {
  background: #fdf8eb;
  border-bottom: 1px solid #fae8be;
  padding: 14px 20px;
  transition: all 0.3s ease;
}

.discount-banner.achieved {
  background: #ebfbee;
  border-color: #b2f2bb;
}

.discount-info {
  font-size: 0.84rem;
  color: #8c6d1f;
  margin-bottom: 8px;
  line-height: 1.5;
}

.discount-info strong {
  color: #1a3c34;
}

.achieved-text {
  color: #2b8a3e !important;
  font-weight: 700;
}

.progress-bar-wrap {
  width: 100%;
  height: 8px;
  background: rgba(26, 60, 52, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a843, #c8a97e);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.progress-fill.full {
  background: linear-gradient(90deg, #25d366, #20ba5a);
}

/* Drawer Body */
.drawer-body {
  flex: 1 1 auto;
  overflow-y: auto; 
  min-height: 0;
  padding: 18px 22px;
}
.cart-empty-view {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.cart-empty-view h4 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: var(--green, #1a3c34);
}

.cart-empty-view p {
  color: var(--text-muted, #5a7a6e);
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.btn-browse-products {
  background: var(--green, #1a3c34);
  color: #faf7ee;
  padding: 12px 28px;
  border-radius: 25px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-browse-products:hover {
  background: var(--accent, #c8a97e);
  color: #0f2820;
}

/* Cart Items */
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(26, 60, 52, 0.05);
  border: 1px solid rgba(26, 60, 52, 0.06);
}

.item-thumb {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--green, #1a3c34);
  margin-bottom: 2px;
  line-height: 1.3;
}

.item-unit {
  display: block;
  font-size: 0.75rem;
  color: var(--accent-dark, #a8895e);
  font-weight: 600;
}

.item-price {
  font-size: 0.78rem;
  color: var(--text-muted, #5a7a6e);
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.qty-stepper {
  display: flex;
  align-items: center;
  border: 1px solid rgba(26, 60, 52, 0.15);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(26, 60, 52, 0.04);
}

.qty-stepper button {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: var(--green, #1a3c34);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-stepper button:hover {
  background: rgba(26, 60, 52, 0.1);
}

.qty-num {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.item-line-total {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--green, #1a3c34);
}

.btn-remove-item {
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  padding: 2px;
  transition: color 0.2s;
}

.btn-remove-item:hover {
  color: #e03131;
}

/* Delivery Form */
.checkout-form-box {
  background: rgba(26, 60, 52, 0.04);
  padding: 14px 16px;
  border-radius: 14px;
  margin-top: 10px;
  border: 1px dashed rgba(26, 60, 52, 0.12);
}

.checkout-form-box h5 {
  font-size: 0.82rem;
  margin-bottom: 12px;
  color: var(--green, #1a3c34);
}

/* Form Inputs & Errors */
.input-group {
  margin-bottom: 12px;
}

.cust-input {
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid rgba(26, 60, 52, 0.12);
  margin-bottom: 2px;
  font-size: 0.85rem;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;
  text-align: right;
}

.cust-input:focus {
  border-color: var(--accent, #c8a97e);
}

.cust-input.input-error {
  border-color: #e03131;
  background-color: #fff5f5;
}

.field-error-msg {
  display: block;
  color: #e03131;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 4px;
  padding-right: 4px;
}

/* Drawer Footer */

.drawer-footer {
  flex: 0 0 auto; 
  padding: 20px 24px;
  border-top: 1px solid rgba(26, 60, 52, 0.08);
  background: #ffffff;
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
}
.totals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted, #5a7a6e);
}

.discount-row {
  color: #2b8a3e;
  font-weight: 700;
}

.discount-val {
  color: #2b8a3e;
}

.final-row {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--green, #1a3c34);
  padding-top: 8px;
  border-top: 1px dashed rgba(26, 60, 52, 0.1);
}

.final-val {
  color: var(--green, #1a3c34);
}

.btn-checkout-wa {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
  background: #25d366;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
  transition: all 0.3s;
}

.btn-checkout-wa:hover {
  background: #20ba5a;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.5);
  color: #ffffff;
}

/* Dark Mode */
[data-theme="dark"] .cart-drawer {
  background: #1a1e1c;
  color: #e8e0d0;
}

[data-theme="dark"] .drawer-header,
[data-theme="dark"] .drawer-footer {
  background: #141816;
  border-color: rgba(232, 224, 208, 0.08);
}

[data-theme="dark"] .cart-item-row {
  background: #1e2422;
  border-color: rgba(232, 224, 208, 0.08);
}

[data-theme="dark"] .drawer-title-wrap h3,
[data-theme="dark"] .item-name,
[data-theme="dark"] .final-row {
  color: #e8e0d0;
}

[data-theme="dark"] .cust-input {
  background: #141816;
  color: #e8e0d0;
  border-color: rgba(232, 224, 208, 0.12);
}

[data-theme="dark"] .cust-input.input-error {
  border-color: #c92a2a;
  background-color: rgba(201, 42, 42, 0.05);
}

[data-theme="dark"] .field-error-msg {
  color: #ff8787;
}

[data-theme="dark"] .qty-stepper {
  background: rgba(232, 224, 208, 0.05);
  border-color: rgba(232, 224, 208, 0.15);
}

[data-theme="dark"] .qty-stepper button {
  color: #e8e0d0;
}

[data-theme="dark"] .discount-banner {
  background: #2b2518;
  border-color: #40341c;
}

[data-theme="dark"] .discount-banner.achieved {
  background: #14281b;
  border-color: #1f3d2a;
}
</style>
