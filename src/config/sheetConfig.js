// ── إعدادات الربط مع شيت الإكسل / Google Sheets والمتجر ──
export const SHEET_CONFIG = {
  // اسم المحل
  storeName: "عطارة وبن أوّاب",

  // رقم الواتساب لاستقبال الطلبات الفورية وسلة المشتريات
  whatsappNumber: "201009569606",

  // رابط شيت جوجل المباشر الخاص بك (تم الربط بنجاح)
  sheetUrl: "https://docs.google.com/spreadsheets/d/116StMRNZ1P9Z5lxaVa_s9u0ET543Twiev2o0RAlzbXA/export?format=csv",

  // مدة صلاحية الكاش المحلي بالدقائق (لتسريع التحميل)
  cacheExpiryMinutes: 2,

  // ── إعدادات الخصم والعروض ──
  // حد الشراء لتطبيق الخصم (إذا تخطى 500 ج.م)
  discountThreshold: 500,

  // نسبة الخصم المئوية (10% عند الشراء بأكثر من 500 ج.م)
  discountPercentage: 10,

  // صور افتراضية معبرة عن أقسام العطارة والمنتجات في الشيت
  defaultCategoryImages: {
    مكرونة_وأرز: "/images/attara_spices.webp",
    زيوت_وسمن: "/images/attara_oils.webp",
    بهارات_ومكعبات_مرق: "/images/attara_spices.webp",
    مشروبات_ساخنة: "/images/attara_coffee.webp",
    بقوليات: "/images/attara_hero.webp",
    حلويات_وتسالي: "/images/attara_hero.webp",
    صوصات_وإضافات: "/images/Magazin de condimente.webp",
    معلبات: "/images/Magazin de condimente.webp",
    سكر_ومحليات: "/images/attara_hero.webp",
    عصائر_ومشروبات: "/images/attara_coffee.webp",
    مستلزمات_حلويات: "/images/attara_spices.webp",
    ألبان_وأجبان: "/images/attara_oils.webp",
    توابل_وبهارات: "/images/attara_spices.webp",
    بن: "/images/attara_coffee.webp",
    زيوت_وكريمات: "/images/attara_oils.webp",
    علافه: "/images/attara_hero.webp",
    سرجه: "/images/attara_oils.webp",
    بقاله: "/images/Magazin de condimente.webp",
    default: "/images/attara_spices.webp",
  },
}
