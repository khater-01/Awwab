// ── إعدادات الربط مع شيت الإكسل / Google Sheets والمتجر ──

// مسار الصور لازم يراعي base بتاع GitHub Pages (/Awwab/) — وإلا الصور بتدي 404
export function assetUrl(path) {
  if (!path) return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path
  const base = import.meta.env.BASE_URL || "/"
  return base + path.replace(/^\/+/, "")
}

export const SHEET_CONFIG = {
  // اسم المحل
  storeName: "عطارة وبن أوّاب",

  // رقم الواتساب لاستقبال الطلبات الفورية وسلة المشتريات
  whatsappNumber: "201037268585",

  // رابط الشيت (أي رابط مشاركة عادي). لازم الشيت يكون مشارك: أي شخص معه الرابط (مشاهد)
  sheetUrl:
    "https://docs.google.com/spreadsheets/d/1MEiu6IJ4IITRE-qBOFA6Qu4kF-aekHGjic7Yz5QgTZk/edit?gid=0",

  // مدة صلاحية الكاش المحلي بالدقائق (بعدها بنحدّث في الخلفية من غير ما الزبون يستنى)
  cacheExpiryMinutes: 3,

  // ── إعدادات الخصم والعروض ──
  // حد الشراء لتطبيق الخصم (إذا تخطى 500 ج.م)
  discountThreshold: 500,

  // نسبة الخصم المئوية (10% عند الشراء بأكثر من 500 ج.م)
  discountPercentage: 10,

  // صور افتراضية معبرة عن أقسام العطارة والمنتجات في الشيت
  defaultCategoryImages: {
    بقاله: assetUrl("/images/grocery.webp"),
    توابل_وبهارات: assetUrl("/images/attara_spices.webp"),
    بن: assetUrl("/images/attara_coffee.webp"),
    زيوت_وكريمات: assetUrl("/images/attara_oils.webp"),
    علافه: assetUrl("/images/attara_hero.webp"),
    سرجه: assetUrl("/images/attara_oils.webp"),
    مكرونة_وأرز: assetUrl("/images/attara_spices.webp"),
    زيوت_وسمن: assetUrl("/images/attara_oils.webp"),
    بهارات_ومكعبات_مرق: assetUrl("/images/attara_spices.webp"),
    مشروبات_ساخنة: assetUrl("/images/attara_coffee.webp"),
    بقوليات: assetUrl("/images/attara_hero.webp"),
    حلويات_وتسالي: assetUrl("/images/attara_hero.webp"),
    صوصات_وإضافات: assetUrl("/images/grocery.webp"),
    معلبات: assetUrl("/images/grocery.webp"),
    سكر_ومحليات: assetUrl("/images/attara_hero.webp"),
    عصائر_ومشروبات: assetUrl("/images/attara_coffee.webp"),
    مستلزمات_حلويات: assetUrl("/images/attara_spices.webp"),
    ألبان_وأجبان: assetUrl("/images/attara_oils.webp"),
    default: assetUrl("/images/attara_spices.webp"),
  },
}
