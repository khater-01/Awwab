import { SHEET_CONFIG } from "../config/sheetConfig.js"
import {
  INITIAL_MENU,
  INITIAL_CATEGORIES,
  buildSearchIndex,
  extractUnitFromName,
  normalizeCategoryKey,
  defaultImageFor,
} from "../data/menu.js"

// v2: غيّرنا شكل الكاش، فبنبدأ بمفتاح جديد عشان نتجاهل أي كاش قديم
const CACHE_KEY = "attara_products_cache_v2"
const STORAGE_SHEET_KEY = "attara_sheet_url"
// مهلة الجلب. الجلب بيحصل في الخلفية ومبيوقفش عرض الصفحة، فنقدر نستنى على النت الضعيف
const FETCH_TIMEOUT_MS = 15000

/**
 * تحويل أي رابط (أو معرّف) لجوجل شيتس إلى رابط CSV مباشر.
 * بنستخدم gviz لأنه الأكثر ثباتًا مع طلبات المتصفح (CORS) من أي موقع.
 */
export function normalizeSheetUrl(inputUrl) {
  if (!inputUrl) return ""
  const trimmed = inputUrl.trim()

  // رابط منشور (Publish to web) — يُستخدم كما هو
  if (trimmed.includes("pub?output=csv") || trimmed.includes("/gviz/tq")) {
    return trimmed
  }

  const matchId = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  const matchGid = trimmed.match(/[?&#]gid=(\d+)/)
  const sheetId = matchId ? matchId[1] : /^[a-zA-Z0-9-_]{20,}$/.test(trimmed) ? trimmed : ""

  if (sheetId) {
    const gid = matchGid ? matchGid[1] : "0"
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`
  }

  return trimmed
}

/**
 * تحليل ملف CSV ومعالجة الفواصل والاقتباسات بدقة
 */
export function parseCSV(text) {
  const lines = []
  let currentRow = []
  let currentCell = ""
  let insideQuotes = false

  // إزالة BOM لو موجود
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)

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

/**
 * قراءة السعر بأي صيغة: 253 / 253.00 / 253٫00 / ١٢٥٠ / 1,250.50 / 1.250,50
 */
export function parsePrice(raw) {
  if (raw == null) return 0
  const s = String(raw)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)) // أرقام عربية-هندية
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/٫/g, ".") // الفاصلة العشرية العربية
    .replace(/٬|\s/g, "") // فاصل الآلاف العربي والمسافات
    .replace(/[^\d.,]/g, "")
  if (!s) return 0

  const lastDot = s.lastIndexOf(".")
  const lastComma = s.lastIndexOf(",")
  const sep = Math.max(lastDot, lastComma)

  if (sep === -1) return parseFloat(s) || 0

  const after = s.length - sep - 1
  const hasBoth = lastDot !== -1 && lastComma !== -1
  // آخر فاصل يعتبر عشري لو: فيه نوعين فواصل، أو بعده رقم/رقمين فقط
  const lastIsDecimal = hasBoth || after <= 2

  if (lastIsDecimal) {
    const intPart = s.slice(0, sep).replace(/[.,]/g, "")
    return parseFloat(`${intPart}.${s.slice(sep + 1)}`) || 0
  }
  // غير كده الفواصل دي فواصل آلاف (مثلاً 1,250)
  return parseFloat(s.replace(/[.,]/g, "")) || 0
}

const NOT_AVAILABLE_WORDS = ["لا", "no", "false", "0", "نفذ", "نفذت", "نفذة"]

function isAvailableValue(val) {
  const v = (val || "").trim().toLowerCase()
  if (!v) return true // خانة فاضية = متوفر
  if (NOT_AVAILABLE_WORDS.includes(v)) return false
  if (v.startsWith("غير") || v.startsWith("مش ")) return false // غير متوفر / غير متاح / مش موجود
  return true
}

/**
 * تحويل صفوف CSV إلى { menu, categories }
 */
export function buildMenuFromRows(rows) {
  if (rows.length < 2) {
    throw new Error("شيت الإكسل فارغ أو لا يحتوي على صفوف بيانات")
  }

  const headers = rows[0]

  // البحث المرن عن الأعمدة
  const nameIdx = findColumnIndex(headers, ["اسم الصنف", "اسم المنتج", "المنتج", "الاسم", "name", "title", "الصنف"])
  const catIdx = findColumnIndex(headers, ["التصنيف (القسم)", "التصنيف", "القسم", "الفئة", "category"])
  const priceIdx = findColumnIndex(headers, ["السعر", "سعر", "price", "egp", "سعر البيع", "ثمن"])
  const unitIdx = findColumnIndex(headers, ["الوحدة", "الوزن", "الحجم", "unit", "weight"])
  const descIdx = findColumnIndex(headers, ["الوصف", "وصف", "فوائد", "desc", "description"])
  const imgIdx = findColumnIndex(headers, ["الصورة", "صورة", "رابط الصورة", "img", "image"])
  const badgeIdx = findColumnIndex(headers, ["شارة", "مميز", "ملاحظة", "badge"])
  const bestIdx = findColumnIndex(headers, ["الأكثر مبيعا", "الاكثر مبيعا", "الأكثر مبيعاً", "أكثر طلبا", "bestseller", "featured"])
  const availIdx = findColumnIndex(headers, ["حالة التوفر", "التوفر", "المتوفر", "الحالة", "available", "status"])

  if (nameIdx === -1) {
    throw new Error("لم يتم العثور على عمود 'اسم المنتج' أو 'الاسم' في الشيت")
  }

  const menu = {}
  const categories = {}

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    const name = row[nameIdx]?.trim()
    if (!name) continue

    const price = priceIdx !== -1 ? parsePrice(row[priceIdx]) : 0

    const rawCat = catIdx !== -1 && row[catIdx] ? row[catIdx].trim() : "أصناف متنوعة"
    const catKey = normalizeCategoryKey(rawCat)
    if (!categories[catKey]) categories[catKey] = rawCat.replace(/_/g, " ")

    const unit = unitIdx !== -1 && row[unitIdx] ? row[unitIdx].trim() : extractUnitFromName(name)
    const desc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : ""

    let img = imgIdx !== -1 && row[imgIdx] ? row[imgIdx].trim() : ""
    if (!img.startsWith("http")) img = defaultImageFor(catKey)

    const badge = badgeIdx !== -1 && row[badgeIdx] ? row[badgeIdx].trim() : ""
    const isBest = bestIdx !== -1 ? ["نعم", "yes", "true", "1"].includes(row[bestIdx]?.trim().toLowerCase()) : false
    const available = availIdx !== -1 ? isAvailableValue(row[availIdx]) : true

    ;(menu[catKey] ||= []).push({
      name,
      price,
      unit,
      desc,
      img,
      badge,
      isBestSeller: isBest,
      available,
      category: catKey,
    })
  }

  if (Object.keys(menu).length === 0) {
    throw new Error("الشيت مفيهوش منتجات")
  }

  return { menu, categories }
}

// ───────────── الكاش المحلي ─────────────

function readCache(url) {
  if (typeof localStorage === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.url !== url || !parsed.menu) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(url, menu, categories) {
  if (typeof localStorage === "undefined") return
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ url, timestamp: Date.now(), menu, categories }))
  } catch (e) {
    console.warn("Storage caching error:", e)
  }
}

function resultFrom({ menu, categories }, extra) {
  return { menu, categories, searchIndex: buildSearchIndex(menu, categories), ...extra }
}

function currentUrl() {
  const raw = SHEET_CONFIG.sheetUrl || (typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_SHEET_KEY) : "")
  return normalizeSheetUrl(raw)
}

/**
 * أسرع نتيجة ممكنة بشكل متزامن (من غير أي نت):
 * آخر نسخة محفوظة على جهاز الزبون، وإلا النسخة الاحتياطية المرفقة مع الموقع.
 * بنستخدمها لرسم الصفحة فورًا قبل ما أي طلب يخلص.
 */
export function getInstantMenu() {
  const url = currentUrl()
  const cached = url ? readCache(url) : null
  if (cached) {
    return resultFrom(cached, {
      isLive: false,
      fromCache: true,
      sheetUrl: url,
      lastUpdated: new Date(cached.timestamp),
      error: null,
    })
  }
  return resultFrom(
    { menu: INITIAL_MENU, categories: INITIAL_CATEGORIES },
    { isLive: false, fromCache: false, sheetUrl: url, lastUpdated: null, error: null }
  )
}

// طلب واحد بس في نفس الوقت، حتى لو 3 أقسام طلبوا البيانات مع بعض
let inFlight = null

async function downloadFromSheet(url) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-cache" })
    if (!response.ok) {
      throw new Error(`تعذر الاتصال بالشيت (${response.status})`)
    }
    const csvText = await response.text()
    // لو الشيت مش مشارك للعامة جوجل بيرجّع صفحة تسجيل دخول HTML
    if (/^\s*<(!doctype|html)/i.test(csvText)) {
      throw new Error("الشيت غير مشارك للعامة — اضبط المشاركة على: أي شخص معه الرابط (مشاهد)")
    }
    return buildMenuFromRows(parseCSV(csvText))
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * جلب بيانات المنتجات الحية من شيت جوجل.
 * - لو الكاش لسه جديد: بيرجع فورًا من غير نت.
 * - لو النت فشل/بطيء: بيرجع آخر نسخة محفوظة، وإلا النسخة الاحتياطية. عمره ما بيرمي خطأ.
 */
export async function fetchLiveMenu(forceRefresh = false) {
  const url = currentUrl()
  if (!url) return getInstantMenu()

  const cached = readCache(url)
  const maxAgeMs = (SHEET_CONFIG.cacheExpiryMinutes || 3) * 60 * 1000
  if (!forceRefresh && cached && Date.now() - cached.timestamp < maxAgeMs) {
    return resultFrom(cached, { isLive: true, fromCache: true, sheetUrl: url, lastUpdated: new Date(cached.timestamp), error: null })
  }

  if (!inFlight) {
    inFlight = downloadFromSheet(url).finally(() => {
      inFlight = null
    })
  }

  try {
    const data = await inFlight
    writeCache(url, data.menu, data.categories)
    return resultFrom(data, { isLive: true, fromCache: false, sheetUrl: url, lastUpdated: new Date(), error: null })
  } catch (err) {
    console.warn("Sheet fetch error:", err)
    const message = err.name === "AbortError" ? "النت بطيء — بنعرض آخر أسعار محفوظة" : err.message
    return { ...getInstantMenu(), error: message }
  }
}

export function getCurrentSheetUrl() {
  return SHEET_CONFIG.sheetUrl || (typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_SHEET_KEY) : "") || ""
}
