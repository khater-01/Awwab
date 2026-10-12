import { ref, computed } from "vue"
import { SHEET_CONFIG } from "../config/sheetConfig.js"

const STORAGE_KEY = "attara_cart_items"

// حالة السلة المركزية (Singleton State)
const cartItems = ref([])
const isCartOpen = ref(false)
const toastMessage = ref("")
let toastTimer = null

// تحميل السلة من التخزين المحلي عند البدء
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    cartItems.value = JSON.parse(saved)
  }
} catch (e) {
  console.warn("Could not read cart from localStorage:", e)
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (e) {
    console.warn("Could not save cart to localStorage:", e)
  }
}

function showToast(msg) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ""
  }, 2500)
}

export function useCart() {
  // إضافة منتج إلى السلة
  function addToCart(product, quantity = 1) {
    const existingIndex = cartItems.value.findIndex((item) => item.name === product.name)
    if (existingIndex > -1) {
      cartItems.value[existingIndex].qty += quantity
    } else {
      cartItems.value.push({
        name: product.name,
        price: Number(product.price) || 0,
        unit: product.unit || "",
        img: product.img || SHEET_CONFIG.defaultCategoryImages.default,
        category: product.category || "",
        qty: quantity,
      })
    }
    saveCart()
    showToast(`تمت إضافة "${product.name}" إلى السلة 🌿`)
  }

  // حذف منتج
  function removeFromCart(productName) {
    cartItems.value = cartItems.value.filter((item) => item.name !== productName)
    saveCart()
  }

  // تحديث الكمية
  function updateQty(productName, newQty) {
    if (newQty <= 0) {
      removeFromCart(productName)
      return
    }
    const item = cartItems.value.find((i) => i.name === productName)
    if (item) {
      item.qty = newQty
      saveCart()
    }
  }

  // إفراغ السلة
  function clearCart() {
    cartItems.value = []
    saveCart()
  }

  // فتح / إغلاق السلة
  function openCart() {
    isCartOpen.value = true
  }

  function closeCart() {
    isCartOpen.value = false
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  // الحسابات
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.qty, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.qty, 0)
  })

  const threshold = computed(() => SHEET_CONFIG.discountThreshold || 500)
  const discountRate = computed(() => SHEET_CONFIG.discountPercentage || 10)

  // هل يستحق الخصم؟ (إذا تجاوز 500 ج.م)
  const hasDiscount = computed(() => subtotal.value >= threshold.value)

  // قيمة الخصم
  const discountAmount = computed(() => {
    if (!hasDiscount.value) return 0
    return Math.round(subtotal.value * (discountRate.value / 100))
  })

  // الإجمالي النهائي بعد الخصم
  const finalTotal = computed(() => {
    return Math.max(0, subtotal.value - discountAmount.value)
  })

  // المبلغ المتبقي للوصول للخصم
  const remainingForDiscount = computed(() => {
    return Math.max(0, threshold.value - subtotal.value)
  })

  // نسبة التقدم نحو الخصم (0 - 100%)
  const discountProgress = computed(() => {
    if (subtotal.value >= threshold.value) return 100
    return Math.min(100, Math.round((subtotal.value / threshold.value) * 100))
  })

  // إنشاء رابط الواتساب مع الفاتورة الكاملة
  function getWhatsAppCheckoutUrl(customer = {}) {
    const phone = SHEET_CONFIG.whatsappNumber || "201009569606"
    if (cartItems.value.length === 0) return `https://wa.me/${phone}`

    let text = `🛒 *طلب جديد من موقع عطارة وبن أوّاب*\n`
    text += `━━━━━━━━━━━━━━━━━━━━\n`

    cartItems.value.forEach((item, idx) => {
      const lineTotal = item.price * item.qty
      const unitText = item.unit ? ` (${item.unit})` : ""
      text += `${idx + 1}. *${item.name}*${unitText}\n`
      text += `   الكمية: ${item.qty} × ${item.price} ج.م = ${lineTotal} ج.م\n`
    })

    text += `━━━━━━━━━━━━━━━━━━━━\n`
    text += `💰 *المجموع الفرعي:* ${subtotal.value} ج.م\n`

    if (hasDiscount.value) {
      text += `🎉 *خصم مشتريات أكثر من 500 ج (${discountRate.value}%):* -${discountAmount.value} ج.م\n`
      text += `✨ *الإجمالي النهائي للدفع:* ${finalTotal.value} ج.م\n`
    } else {
      text += `✨ *الإجمالي النهائي للدفع:* ${finalTotal.value} ج.م\n`
    }

    if (customer.name || customer.phone || customer.address || customer.notes) {
      text += `━━━━━━━━━━━━━━━━━━━━\n`
      text += `👤 *بيانات العميل:*\n`
      if (customer.name) text += `• الاسم: ${customer.name}\n`
      if (customer.phone) text += `• الهاتف: ${customer.phone}\n`
      if (customer.address) text += `• العنوان: ${customer.address}\n`
      if (customer.notes) text += `• ملاحظات: ${customer.notes}\n`
    }

    text += `━━━━━━━━━━━━━━━━━━━━\n`
    text += `برجاء تأكيد الطلب وموعد التوصيل، شكراً لكم!`

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }

  return {
    cartItems,
    isCartOpen,
    toastMessage,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    subtotal,
    threshold,
    discountRate,
    hasDiscount,
    discountAmount,
    finalTotal,
    remainingForDiscount,
    discountProgress,
    getWhatsAppCheckoutUrl,
  }
}
