<template>
  <Teleport to="body">
    <div v-if="isOpen" class="sheet-modal-overlay" @click.self="$emit('close')">
      <div class="sheet-modal-panel">
        <div class="sheet-modal-header">
          <div class="header-title-wrap">
            <div class="sheet-icon-wrap">📊</div>
            <div>
              <h3>إدارة وربط شيت الإكسل (Google Sheets)</h3>
              <p>لتحديث المنتجات، الأسعار والمخزون مباشرة من هاتفك أو حاسوبك</p>
            </div>
          </div>
          <button class="sheet-modal-close" @click="$emit('close')">&times;</button>
        </div>

        <div class="sheet-modal-body">
          <!-- Step by step guidance -->
          <div class="guide-steps">
            <h4>💡 خطوات ربط شيت الأكسل في دقيقة واحدة:</h4>
            <ol>
              <li>
                <strong>أنشئ أو افتح الشيت:</strong> اكتب أسماء الأعمدة في الصف الأول:
                <code>الاسم</code> ، <code>القسم</code> ، <code>السعر</code> ، <code>الوحدة</code> ، <code>الوصف</code> ، <code>الصورة</code> ، <code>متوفر</code>
              </li>
              <li>
                <strong>مشاركة الشيت:</strong> اضغط زر <strong>مشاركة (Share)</strong> بالأعلى واجعله <em>"أي شخص لديه الرابط يمكنه العرض" (Anyone with link can view)</em>.
              </li>
              <li>
                <strong>الصق الرابط:</strong> انسخ رابط الشيت وضعه في الحقل بالأسفل واضغط حفظ!
              </li>
            </ol>
          </div>

          <!-- Input field -->
          <div class="form-group">
            <label for="sheetUrlInput">رابط شيت جوجل (Google Sheet URL أو ID):</label>
            <div class="input-with-button">
              <input
                id="sheetUrlInput"
                type="text"
                v-model="inputUrl"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                dir="ltr"
              />
            </div>
            <span class="field-hint">
              يمكنك لصق رابط الشيت العادي من شريط المتصفح مباشرة أو رابط CSV المنشور.
            </span>
          </div>

          <!-- Status Message -->
          <div v-if="statusMsg" class="status-alert" :class="statusType">
            <span>{{ statusMsg }}</span>
          </div>
        </div>

        <div class="sheet-modal-footer">
          <div class="footer-left">
            <button class="btn-secondary" @click="resetToDefault" :disabled="loading">
              استعادة الافتراضي
            </button>
          </div>
          <div class="footer-right">
            <button class="btn-cancel" @click="$emit('close')">إلغاء</button>
            <button class="btn-save" @click="saveAndConnect" :disabled="loading">
              <span v-if="loading">جاري الاتصال والتحقق... ⏳</span>
              <span v-else>حفظ وتحديث الموقع 🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue"
import { getCurrentSheetUrl, saveCustomSheetUrl } from "../services/sheetService.js"

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["close", "sheet-updated"])

const inputUrl = ref("")
const loading = ref(false)
const statusMsg = ref("")
const statusType = ref("info")

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      inputUrl.value = getCurrentSheetUrl()
      statusMsg.value = ""
    }
  }
)

async function saveAndConnect() {
  loading.value = true
  statusMsg.value = "جاري الاتصال بشيت الإكسل وفحص البيانات..."
  statusType.value = "info"

  try {
    const res = await saveCustomSheetUrl(inputUrl.value)
    if (res.error) {
      statusMsg.value = `❌ تعذر قراءة الشيت: ${res.error}. يرجى التأكد من تفعيل صلاحية المشاركة "Anyone with link can view".`
      statusType.value = "error"
    } else {
      statusMsg.value = "✅ تم الربط بنجاح! يتم الآن عرض المنتجات والأسعار الحية من شيت الإكسل."
      statusType.value = "success"
      emit("sheet-updated", res)
      setTimeout(() => {
        emit("close")
      }, 1500)
    }
  } catch (err) {
    statusMsg.value = `❌ خطأ غير متوقع: ${err.message}`
    statusType.value = "error"
  } finally {
    loading.value = false
  }
}

async function resetToDefault() {
  inputUrl.value = ""
  loading.value = true
  try {
    const res = await saveCustomSheetUrl("")
    statusMsg.value = "تمت العودة إلى قائمة المنتجات الافتراضية بنجاح."
    statusType.value = "success"
    emit("sheet-updated", res)
    setTimeout(() => {
      emit("close")
    }, 1200)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sheet-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 40, 32, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  direction: rtl;
}

.sheet-modal-panel {
  background: var(--cream-light, #FAF7EE);
  color: var(--green, #1A3C34);
  width: 650px;
  max-width: 95vw;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  border: 1.5px solid rgba(200, 169, 126, 0.3);
  overflow: hidden;
  animation: popIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
}

.sheet-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid rgba(26, 60, 52, 0.08);
  background: rgba(26, 60, 52, 0.03);
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sheet-icon-wrap {
  font-size: 2rem;
  background: rgba(200, 169, 126, 0.2);
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title-wrap h3 {
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
  color: var(--green, #1A3C34);
}

.header-title-wrap p {
  font-size: 0.85rem;
  color: var(--text-muted, #5A7A6E);
  margin-top: 4px;
}

.sheet-modal-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--green, #1A3C34);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.sheet-modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  max-height: 65vh;
}

.guide-steps {
  background: rgba(26, 60, 52, 0.04);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 22px;
  border: 1px solid rgba(26, 60, 52, 0.08);
}

.guide-steps h4 {
  font-size: 0.95rem;
  margin-bottom: 10px;
  color: var(--green, #1A3C34);
}

.guide-steps ol {
  padding-right: 20px;
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text-muted, #5A7A6E);
}

.guide-steps code {
  background: rgba(200, 169, 126, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
  color: #1a3c34;
  font-size: 0.82rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--green, #1A3C34);
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(26, 60, 52, 0.15);
  background: #ffffff;
  color: #1a3c34;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--accent, #C8A97E);
  box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.2);
}

.field-hint {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted, #5A7A6E);
  margin-top: 6px;
}

.status-alert {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.88rem;
  margin-top: 14px;
  font-weight: 600;
}

.status-alert.info {
  background: rgba(200, 169, 126, 0.15);
  color: #8b6b3e;
}

.status-alert.error {
  background: #ffe6e6;
  color: #c92a2a;
  border: 1px solid #ffc9c9;
}

.status-alert.success {
  background: #ebfbee;
  color: #2b8a3e;
  border: 1px solid #b2f2bb;
}

.sheet-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-top: 1px solid rgba(26, 60, 52, 0.08);
  background: rgba(26, 60, 52, 0.02);
}

.footer-right, .footer-left {
  display: flex;
  gap: 12px;
}

.btn-save {
  background: var(--green, #1A3C34);
  color: #FAF7EE;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: var(--green-light, #2A5A4E);
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel, .btn-secondary {
  background: none;
  border: 1px solid rgba(26, 60, 52, 0.15);
  padding: 10px 18px;
  border-radius: 25px;
  font-weight: 600;
  color: var(--green, #1A3C34);
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cancel:hover, .btn-secondary:hover {
  background: rgba(26, 60, 52, 0.05);
}

/* Dark Mode */
[data-theme="dark"] .sheet-modal-panel {
  background: #1E2422;
  color: #E8E0D0;
  border-color: rgba(232, 224, 208, 0.1);
}

[data-theme="dark"] .sheet-modal-header,
[data-theme="dark"] .sheet-modal-footer {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(232, 224, 208, 0.08);
}

[data-theme="dark"] .header-title-wrap h3,
[data-theme="dark"] .sheet-modal-close,
[data-theme="dark"] .form-group label,
[data-theme="dark"] .guide-steps h4 {
  color: #E8E0D0;
}

[data-theme="dark"] .guide-steps {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}

[data-theme="dark"] .form-group input {
  background: #141816;
  color: #E8E0D0;
  border-color: rgba(232, 224, 208, 0.15);
}

[data-theme="dark"] .btn-save {
  background: var(--accent, #D4B896);
  color: #080F0C;
}

[data-theme="dark"] .btn-cancel,
[data-theme="dark"] .btn-secondary {
  border-color: rgba(232, 224, 208, 0.2);
  color: #E8E0D0;
}
</style>
