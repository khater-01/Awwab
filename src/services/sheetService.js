import { SHEET_CONFIG } from "../config/sheetConfig.js"
import { INITIAL_MENU, CATEGORY_NAMES, CATEGORY_ICONS, buildSearchIndex } from "../data/menu.js"

const CACHE_KEY = "attara_products_cache"
const STORAGE_SHEET_KEY = "attara_sheet_url"

/**
 * استخراج رابط CSV المباشر من أي رابط أو معرف لجوجل شيتس
 */
export function normalizeSheetUrl(inputUrl) {
  if (!inputUrl) return ""
  const trimmed = inputUrl.trim()

  if (trimmed.includes("pub?output=csv") || trimmed.includes("export?format=csv")) {
    return trimmed
  }

  const matchId = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (matchId && matchId[1]) {
    const sheetId = matchId[1]
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return `https://docs.google.com/spreadsheets/d/${trimmed}/export?format=csv`
  }

  return trimmed
}

/**
 * استخراج الوحدة الذكية من اسم الصنف إن لم تكن محددة
 */
function extractUnitFromName(name) {
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

/**
 * تحليل ملف CSV ومعالجة الفواصل والاقتباسات بدقة
 */
function parseCSV(text) {
  const lines = []
  let currentRow = []
  let currentCell = ""
  let insideQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim())
      currentCell = ""
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++
      currentRow.push(currentCell.trim())
      if (currentRow.some((c) => c !== "")) {
        lines.push(currentRow)
      }
      currentRow = []
      currentCell = ""
    } else {
      currentCell += char
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim())
    if (currentRow.some((c) => c !== "")) {
      lines.push(currentRow)
    }
  }

  return lines
}

function findColumnIndex(headers, aliases) {
  return headers.findIndex((h) => {
    const clean = h.replace(/["\r\n]/g, "").trim().toLowerCase()
    return aliases.some((alias) => clean === alias.toLowerCase() || clean.includes(alias.toLowerCase()))
  })
}

function normalizeCategoryKey(rawCat) {
  if (!rawCat) return "عام"
  return rawCat.trim().replace(/\s+/g, "_")
}

/**
 * جلب بيانات المنتجات الحية من شيت الإكسل
 */
export async function fetchLiveMenu(forceRefresh = false) {
  const currentSheetUrl = SHEET_CONFIG.sheetUrl || (typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_SHEET_KEY) : "")
  const normalizedUrl = normalizeSheetUrl(currentSheetUrl)

  if (!normalizedUrl) {
    return {
      menu: INITIAL_MENU,
      categories: CATEGORY_NAMES,
      searchIndex: buildSearchIndex(INITIAL_MENU),
      isLive: false,
      sheetUrl: "",
      lastUpdated: null,
      error: null,
    }
  }

  // الكاش السريع
  if (!forceRefresh && typeof localStorage !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsedCache = JSON.parse(cached)
        const ageMs = Date.now() - parsedCache.timestamp
        const maxAgeMs = (SHEET_CONFIG.cacheExpiryMinutes || 2) * 60 * 1000
        if (ageMs < maxAgeMs && parsedCache.url === normalizedUrl) {
          return {
            menu: parsedCache.menu,
            categories: parsedCache.categories,
            searchIndex: buildSearchIndex(parsedCache.menu),
            isLive: true,
            sheetUrl: normalizedUrl,
            lastUpdated: new Date(parsedCache.timestamp),
            error: null,
          }
        }
      }
    } catch (e) {
      console.warn("Error reading cache:", e)
    }
  }

  // جلب البيانات مباشرة من شيت جوجل
  try {
    const cacheBusterUrl = `${normalizedUrl}${normalizedUrl.includes("?") ? "&" : "?"}_t=${Date.now()}`
    const response = await fetch(cacheBusterUrl)

    if (!response.ok) {
      throw new Error(`تعذر الاتصال بالشيت (${response.status} ${response.statusText})`)
    }

    const csvText = await response.text()
    const rows = parseCSV(csvText)

    if (rows.length < 2) {
      throw new Error("شيت الإكسل فارغ أو لا يحتوي على صفوف بيانات")
    }

    const headers = rows[0]

    // البحث المرن عن الأعمدة
    const nameIdx = findColumnIndex(headers, ["اسم الصنف", "الاسم", "اسم المنتج", "المنتج", "name", "title", "الصنف"])
    const catIdx = findColumnIndex(headers, ["التصنيف (القسم)", "التصنيف", "القسم", "الفئة", "category", "cat"])
    const priceIdx = findColumnIndex(headers, ["السعر", "سعر", "price", "egp", "سعر البيع", "ثمن"])
    const unitIdx = findColumnIndex(headers, ["الوحدة", "الوزن", "الحجم", "unit", "weight"])
    const descIdx = findColumnIndex(headers, ["الوصف", "وصف", "فوائد", "desc", "description"])
    const imgIdx = findColumnIndex(headers, ["الصورة", "صورة", "رابط الصورة", "img", "image"])
    const badgeIdx = findColumnIndex(headers, ["شارة", "مميز", "ملاحظة", "badge", "tag"])
    const bestIdx = findColumnIndex(headers, ["الأكثر مبيعا", "الاكثر مبيعا", "أكثر طلبا", "bestseller", "featured"])
    const availIdx = findColumnIndex(headers, ["متوفر", "المتوفر", "الحالة", "available", "status"])

    if (nameIdx === -1) {
      throw new Error("لم يتم العثور على عمود 'اسم الصنف' أو 'الاسم' في الشيت")
    }

    const parsedMenu = {}
    const dynamicCategories = {}

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r]
      const name = row[nameIdx]?.trim()
      if (!name) continue

      // قراءة السعر: إذا لم يتوفر عمود السعر بعد، نضع سعراً افتراضياً تقديرياً
      let price = 0
      if (priceIdx !== -1 && row[priceIdx]) {
        const rawPrice = row[priceIdx].replace(/[^\d.]/g, "")
        price = parseFloat(rawPrice) || 0
      } else {
        // سعر افتراضي في حال لم يُضف عمود السعر بعد في الشيت
        price = 35
      }

      const rawCat = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : "أصناف_متنوعة"
      const catKey = normalizeCategoryKey(rawCat)

      if (!dynamicCategories[catKey]) {
        dynamicCategories[catKey] = rawCat.replace(/_/g, " ")
      }

      // الوحدة
      let unit = ""
      if (unitIdx !== -1 && row[unitIdx]) {
        unit = row[unitIdx].trim()
      } else {
        unit = extractUnitFromName(name)
      }

      const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : `منتج طازج ومضمون من ${dynamicCategories[catKey]}`
      let img = imgIdx !== -1 && row[imgIdx] ? row[imgIdx].trim() : ""

      if (!img || (!img.startsWith("http") && !img.startsWith("/"))) {
        img = SHEET_CONFIG.defaultCategoryImages[catKey] || SHEET_CONFIG.defaultCategoryImages.default
      }

      const badge = badgeIdx !== -1 && row[badgeIdx] ? row[badgeIdx].trim() : "طبيعي 100%"
      const isBest = bestIdx !== -1 ? ["نعم", "yes", "true", "1"].includes(row[bestIdx]?.trim().toLowerCase()) : false
      const available = availIdx !== -1 ? !["لا", "no", "false", "0", "غير متوفر"].includes(row[availIdx]?.trim().toLowerCase()) : true

      const product = {
        name,
        price,
        unit,
        desc,
        img,
        badge,
        isBestSeller: isBest,
        available,
        category: catKey,
      }

      if (!parsedMenu[catKey]) {
        parsedMenu[catKey] = []
      }
      parsedMenu[catKey].push(product)
    }

    // حفظ في الكاش
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            url: normalizedUrl,
            timestamp: Date.now(),
            menu: parsedMenu,
            categories: dynamicCategories,
          })
        )
      } catch (e) {
        console.warn("Storage caching error:", e)
      }
    }

    return {
      menu: parsedMenu,
      categories: dynamicCategories,
      searchIndex: buildSearchIndex(parsedMenu),
      isLive: true,
      sheetUrl: normalizedUrl,
      lastUpdated: new Date(),
      error: null,
    }
  } catch (err) {
    console.error("Sheet fetch error:", err)
    return {
      menu: INITIAL_MENU,
      categories: CATEGORY_NAMES,
      searchIndex: buildSearchIndex(INITIAL_MENU),
      isLive: false,
      sheetUrl: normalizedUrl,
      lastUpdated: null,
      error: err.message,
    }
  }
}

export function getCurrentSheetUrl() {
  return SHEET_CONFIG.sheetUrl || localStorage.getItem(STORAGE_SHEET_KEY) || ""
}
