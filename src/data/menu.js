// ── بيانات المنتجات الافتراضية لعطارة وبن أوّاب ──
// في حال تفعيل شيت جوجل، يتم جلب البيانات مباشرة من الشيت وتحديثها تلقائياً

export const CATEGORY_NAMES = {
  توابل_وبهارات: "توابل وبهارات",
  بن: "بن وقهوة",
  زيوت_وكريمات: "زيوت طبيعية وكريمات",
  علافه: "علافة ومكسرات",
  سرجه: "سرجة وعسل",
  بقاله: "أعشاب وبقالة طبيعية",
}

export const CATEGORY_ICONS = {
  توابل_وبهارات: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9A9 9 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>`,
  بن: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  زيوت_وكريمات: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v3"/><path d="M14 2v3"/><path d="M8.5 5h7l1.5 5v11a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V10l1.5-5z"/><circle cx="12" cy="15" r="2.5"/></svg>`,
  علافه: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.5-.74 1.5-1.5 0-.4-.15-.75-.38-1.01-.23-.27-.38-.62-.38-1.01 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-8.98-10-8.98z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>`,
  سرجه: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l1 6H5l1-6z"/><path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/></svg>`,
  بقاله: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
}

export const INITIAL_MENU = {
  توابل_وبهارات: [
    {
      name: "حبهان (هيل) أمريكي جامبو أخضر",
      price: 850,
      unit: "ربع كيلو",
      desc: "حبهان أمريكي درجة أولى حبة كاملة خضراء برائحة نفاذة وطعم قوي للقهوة والشوربات.",
      img: "/images/attara_spices.webp",
      badge: "درجة أولى فاخر",
      isBestSeller: true,
      available: true,
    },
    {
      name: "كمون بلدي منقى ومطحون طازج",
      price: 120,
      unit: "نصف كيلو",
      desc: "كمون بلدي طبيعي 100% منقى يدوياً من الشوائب ومطحون طازج بنكهة غنية وزكية.",
      img: "/images/attara_spices.webp",
      badge: "طبيعي 100%",
      isBestSeller: true,
      available: true,
    },
    {
      name: "فلفل أسود برازيلي حب ومطحون",
      price: 140,
      unit: "نصف كيلو",
      desc: "فلفل أسود برازيلي أصلي حبة خشنة كاملة، حرارة زكية ونكهة قوية لجميع الأكلات.",
      img: "/images/attara_spices.webp",
      badge: "أكثر طلباً",
      isBestSeller: false,
      available: true,
    },
    {
      name: "زعفران إسباني سوبر نقيل أصلي",
      price: 160,
      unit: "جرام نقي",
      desc: "خيوط زعفران طبيعية فاخرة بلون أحمر ياقوتي ونكهة عطرية ملكية لا تقاوم.",
      img: "/images/attara_spices.webp",
      badge: "ملك التوابل",
      isBestSeller: true,
      available: true,
    },
    {
      name: "بهارات لحم وفراخ خصوصي أواب",
      price: 95,
      unit: "250 جرام",
      desc: "خلطة سرية معتمدة من 12 نوع بهار طبيعي ممزوج بنسب مثالية للمشويات والصواني.",
      img: "/images/attara_spices.webp",
      badge: "خلطة أواب الخاصة",
      isBestSeller: true,
      available: true,
    },
    {
      name: "قرفة سيلاني أصلية خشب",
      price: 110,
      unit: "ربع كيلو",
      desc: "قرفة سيلاني طبيعية هشة برائحة عطرية زكية ونكهة حُلوة وخالية من مادة الكومارين الضارة.",
      img: "/images/attara_spices.webp",
      badge: "سيلاني نقي",
      isBestSeller: false,
      available: true,
    },
  ],

  بن: [
    {
      name: "بن أواب محوج كلاسيك (وسط / فاتح)",
      price: 130,
      unit: "ربع كيلو",
      desc: "توليفة ممتازة من البن البرازيلي والكولومبي محوجة بالحبهان، المستكة وزر الورد.",
      img: "/images/attara_coffee.webp",
      badge: "الأكثر مبيعاً ⭐",
      isBestSeller: true,
      available: true,
    },
    {
      name: "بن أواب محوج ملكي (دبل هيل)",
      price: 160,
      unit: "ربع كيلو",
      desc: "عشاق الهيل المركز! تحويجة ملكية بحبات الهيل الأمريكي الأخضر والمستكة اليونانية.",
      img: "/images/attara_coffee.webp",
      badge: "تحويجة ملكية",
      isBestSeller: true,
      available: true,
    },
    {
      name: "بن سادة أرابيكا 100% (وسط / غامق)",
      price: 110,
      unit: "ربع كيلو",
      desc: "بن أرابيكا نقي محمص يومياً بعناية، وش كثيف ونكهة متوازنة بنوتات الشوكولاتة الداكنة.",
      img: "/images/attara_coffee.webp",
      badge: "تحميص طازج",
      isBestSeller: false,
      available: true,
    },
    {
      name: "بن فرنسي بالبندق والشوكولاتة",
      price: 120,
      unit: "ربع كيلو",
      desc: "قهوة فرنسية ناعمة مع كريمة الحليب ونكهة البندق المحمص الطبيعي.",
      img: "/images/attara_coffee.webp",
      badge: "نكهة مميزة",
      isBestSeller: false,
      available: true,
    },
  ],

  زيوت_وكريمات: [
    {
      name: "زيت زيتون سيناوي بكر ممتاز معصور بارد",
      price: 220,
      unit: "زجاجة 1 لتر",
      desc: "معصور على البارد من أجود حبات زيتون سيناء، حموضة أقل من 0.7% غني بالأوميجا.",
      img: "/images/attara_oils.webp",
      badge: "عصرة أولى ع البارد",
      isBestSeller: true,
      available: true,
    },
    {
      name: "زيت حبة البركة الحبشي النقي 100%",
      price: 90,
      unit: "عبوة 125 مل",
      desc: "زيت الحبة السوداء الأصلي معصور هيدروليكياً، لتقوية المناعة وسلامة الشعر.",
      img: "/images/attara_oils.webp",
      badge: "طبيعي 100%",
      isBestSeller: false,
      available: true,
    },
    {
      name: "زيت لوز حلو طبيعي للبشرة والشعر",
      price: 85,
      unit: "عبوة 100 مل",
      desc: "مرطب طبيعي فائق خفيف على البشرة، يقاوم التجاعيد ويغذي بصيلات الشعر الجاف.",
      img: "/images/attara_oils.webp",
      badge: "نقاء تام",
      isBestSeller: false,
      available: true,
    },
    {
      name: "زيت جوجوبا بكر ذهبي خام",
      price: 110,
      unit: "عبوة 100 مل",
      desc: "بديل طبيعي للسيروم، مهدئ للبشرة ومنظم للإفرازات الدهنية ومغذي للأظافر.",
      img: "/images/attara_oils.webp",
      badge: "أصلي معتمد",
      isBestSeller: false,
      available: true,
    },
  ],

  علافه: [
    {
      name: "لوز أمريكي نيء حبة كبيرة",
      price: 195,
      unit: "نصف كيلو",
      desc: "حبات لوز كاليفورنيا طازجة مقرمشة بدون أي ملح أو تحميص، غنية بالبروتين والمعادن.",
      img: "/images/attara_hero.webp",
      badge: "حبة جامبو",
      isBestSeller: true,
      available: true,
    },
    {
      name: "عين جمل تشيلي قلب أبيض اكسترا",
      price: 180,
      unit: "نصف كيلو",
      desc: "عين جمل طازج خالي من المرارة، قوام غني ونكهة سكرية طبيعية ومصدر ممتاز للأوميجا 3.",
      img: "/images/attara_hero.webp",
      badge: "طازج ونقي",
      isBestSeller: false,
      available: true,
    },
    {
      name: "كاجو محمص جامبو ومملح خفيف",
      price: 210,
      unit: "نصف كيلو",
      desc: "كاجو فاخر محمص بالهواء الساخن مع لمسة ملح بحري خفيف لقرمشة لا تقاوم.",
      img: "/images/attara_hero.webp",
      badge: "قرمشة فاخرة",
      isBestSeller: false,
      available: true,
    },
    {
      name: "سمسم بلدي أبيض وأحمر منقى",
      price: 60,
      unit: "نصف كيلو",
      desc: "سمسم مصري بلدي منقى بالغربال خالي تماماً من الأتربة والحصى ومثالي للمخبوزات.",
      img: "/images/attara_hero.webp",
      badge: "بلدي 100%",
      isBestSeller: false,
      available: true,
    },
  ],

  سرجه: [
    {
      name: "طحينة سمسم بلدي حجر الرحى بيضاء وحمراء",
      price: 110,
      unit: "كيلو صافي",
      desc: "طحينة بيور 100% سمسم بلدي صافي معصورة على الحجر بدون نقطة دقيق أو زيت مضاف.",
      img: "/images/attara_oils.webp",
      badge: "بدون دقيق 100%",
      isBestSeller: true,
      available: true,
    },
    {
      name: "عسل نحل سدر جبلي حر مضمون",
      price: 280,
      unit: "برطمان كيلو",
      desc: "عسل سدر طبيعي خام مفحوص معملياً، قوام كثيف ورائحة زهرية غنية وطاقة وحيوية.",
      img: "/images/attara_oils.webp",
      badge: "مفحوص معملياً",
      isBestSeller: true,
      available: true,
    },
    {
      name: "عسل أسود قناوي أصلي بنقاوة السكر",
      price: 65,
      unit: "برطمان كيلو",
      desc: "عسل قصب سكر طبيعي من مصانع قنا، خالي من أي مواد حافظة وغني بعنصر الحديد.",
      img: "/images/attara_oils.webp",
      badge: "طبيعي قناوي",
      isBestSeller: false,
      available: true,
    },
    {
      name: "زيت حار بلدي معصور ع البارد (بذرة الكتان)",
      price: 75,
      unit: "زجاجة نصف لتر",
      desc: "زيت بذرة الكتان الأصلي برائحة بلدي زكية وقوام غني للفول والأجبان.",
      img: "/images/attara_oils.webp",
      badge: "معصور طازج",
      isBestSeller: false,
      available: true,
    },
  ],

  بقاله: [
    {
      name: "كركديه أسواني لوزة كاملة درجة أولى",
      price: 75,
      unit: "نصف كيلو",
      desc: "زهور كركديه أسواني كاملة بدون كسر أو تراب، لون أحمر داكن وطعم منعش طبيعي.",
      img: "/images/Magazin de condimente.webp",
      badge: "أسواني أصيل",
      isBestSeller: true,
      available: true,
    },
    {
      name: "يانسون بلدي نجمي وزهور بابونج (كاموميل)",
      price: 85,
      unit: "ربع كيلو",
      desc: "أعشاب طبيعية منتقاة لتهدئة الأعصاب والمعدة والمساعدة على النوم العميق.",
      img: "/images/Magazin de condimente.webp",
      badge: "أعشاب مهدئة",
      isBestSeller: false,
      available: true,
    },
    {
      name: "لبان دكر حوجري عماني فاخر",
      price: 90,
      unit: "100 جرام",
      desc: "لبان دكر طبيعي أبيض شفاف صالح للمضغ والشراب والكولاجين الطبيعي للبشرة.",
      img: "/images/Magazin de condimente.webp",
      badge: "حوجري عماني",
      isBestSeller: false,
      available: true,
    },
  ],
}

// بناء فهرس بحث مسطح وسريع
export function buildSearchIndex(menuData = INITIAL_MENU) {
  const index = []
  for (const [category, items] of Object.entries(menuData)) {
    items.forEach((item) => {
      index.push({
        ...item,
        category,
        categoryName: CATEGORY_NAMES[category] || category,
        icon: CATEGORY_ICONS[category] || "🌿",
      })
    })
  }
  return index
}

export const MENU = INITIAL_MENU
export const SEARCH_INDEX = buildSearchIndex(INITIAL_MENU)
