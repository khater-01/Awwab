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
    مكرونة_وأرز: "/images/attara_spices.png",
    زيوت_وسمن: "/images/attara_oils.png",
    بهارات_ومكعبات_مرق: "/images/attara_spices.png",
    مشروبات_ساخنة: "/images/attara_coffee.png",
    بقوليات: "/images/attara_hero.png",
    حلويات_وتسالي: "/images/attara_hero.png",
    صوصات_وإضافات: "/images/Magazin de condimente.jpg",
    معلبات: "/images/Magazin de condimente.jpg",
    سكر_ومحليات: "/images/attara_hero.png",
    عصائر_ومشروبات: "/images/attara_coffee.png",
    مستلزمات_حلويات: "/images/attara_spices.png",
    ألبان_وأجبان: "/images/attara_oils.png",
    توابل_وبهارات: "/images/attara_spices.png",
    بن: "/images/attara_coffee.png",
    زيوت_وكريمات: "/images/attara_oils.png",
    علافه: "/images/attara_hero.png",
    سرجه: "/images/attara_oils.png",
    بقاله: "/images/Magazin de condimente.jpg",
    default: "/images/attara_spices.png",
  },
}
