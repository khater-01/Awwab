// ── أسماء الأقسام وأيقوناتها + نسخة احتياطية من المنتجات ──
// المنتجات الحقيقية بتيجي من شيت جوجل. النسخة الاحتياطية (snapshot.js) بتظهر فورًا
// لحد ما البيانات الحية توصل، فالزبون عمره ما يشوف شاشة فاضية ولا أسعار وهمية.
import { SHEET_CONFIG } from "../config/sheetConfig.js"
import { SNAPSHOT_ROWS } from "./snapshot.js"

export const CATEGORY_NAMES = {
  توابل_وبهارات: "توابل وبهارات",
  بن: "بن وقهوة",
  زيوت_وكريمات: "زيوت طبيعية وكريمات",
  علافه: "علافة ومكسرات",
  سرجه: "سرجة وعسل",
  بقاله: "بقالة",
}

export const CATEGORY_ICONS = {
  توابل_وبهارات: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9A9 9 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>`,
  بن: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  زيوت_وكريمات: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v3"/><path d="M14 2v3"/><path d="M8.5 5h7l1.5 5v11a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V10l1.5-5z"/><circle cx="12" cy="15" r="2.5"/></svg>`,
  علافه: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.5-.74 1.5-1.5 0-.4-.15-.75-.38-1.01-.23-.27-.38-.62-.38-1.01 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-8.98-10-8.98z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>`,
  سرجه: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l1 6H5l1-6z"/><path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>`,
  بقاله: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
}


/**
 * استخراج الوحدة الذكية من اسم الصنف إن لم تكن محددة
 */
export function extractUnitFromName(name) {
  if (!name) return "قطعة"
  if (name.includes("ربع كيلو")) return "ربع كيلو"
  if (name.includes("نصف كيلو") || name.includes("نص كيلو")) return "نصف كيلو"
  if (name.includes("كيلو")) return "1 كيلو"
  if (name.includes("كرتونة")) return "كرتونة"
  if (name.includes("علبة")) return "علبة"
  if (name.includes("برطمان")) return "برطمان"
  if (name.includes("كيس")) return "كيس"

  const gramMatch = name.match(/(\d+)\s*(جرام|جم|g)/i)
  if (gramMatch) return `${gramMatch[1]} جرام`

  const literMatch = name.match(/(\d+(\.\d+)?)\s*(لتر|مل|L)/i)
  if (literMatch) return `${literMatch[1]} لتر`

  const numMatch = name.match(/\s+(\d{2,4})$/)
  if (numMatch) return `${numMatch[1]} جم`

  return "قطعة"
}

export function normalizeCategoryKey(rawCat) {
  if (!rawCat) return "عام"
  return rawCat.trim().replace(/\s+/g, "_")
}

export function defaultImageFor(catKey) {
  return SHEET_CONFIG.defaultCategoryImages[catKey] || SHEET_CONFIG.defaultCategoryImages.default
}

// ── النسخة الاحتياطية: منتجات الشيت وقت آخر تحديث للمشروع ──
function buildSnapshotMenu() {
  const menu = {}
  const categories = {}
  for (const [, name, cat, price, avail] of SNAPSHOT_ROWS) {
    const key = normalizeCategoryKey(cat)
    categories[key] = CATEGORY_NAMES[key] || cat
    ;(menu[key] ||= []).push({
      name,
      price,
      unit: extractUnitFromName(name),
      desc: "",
      img: defaultImageFor(key),
      badge: "",
      isBestSeller: false,
      available: !!avail,
      category: key,
    })
  }
  return { menu, categories }
}

const SNAPSHOT = buildSnapshotMenu()
export const INITIAL_MENU = SNAPSHOT.menu
export const INITIAL_CATEGORIES = SNAPSHOT.categories

// بناء فهرس بحث مسطح وسريع
export function buildSearchIndex(menuData = INITIAL_MENU, categories = {}) {
  const index = []
  for (const [category, items] of Object.entries(menuData)) {
    items.forEach((item) => {
      index.push({
        ...item,
        category,
        categoryName: categories[category] || CATEGORY_NAMES[category] || category.replace(/_/g, " "),
        icon: CATEGORY_ICONS[category] || "🌿",
      })
    })
  }
  return index
}

export const MENU = INITIAL_MENU
export const SEARCH_INDEX = buildSearchIndex(INITIAL_MENU, INITIAL_CATEGORIES)
