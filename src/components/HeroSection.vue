<template>
  <section class="hero" id="hero" dir="rtl">
    <div class="container">
      <div class="hero-content">
        <h1>
          رحلة في أصالة <em>التوابل والأعشاب</em> ونقاء الطبيعة
        </h1>
        <p>
          استكشف تشكيلتنا الواسعة من أجود أنواع البهارات المنقاة يدوياً، الأعشاب الطبيعية،
          الزيوت المعصورة على البارد، وتوليفات البن المحوج الطازج يومياً. كل صنف نختاره بعناية ليمنحك جودة لا تضاهى.
        </p>
        <div class="hero-btns">
          <a href="#menu" class="btn-primary" id="btnViewMenu">
            <span>تصفح المنتجات والأسعار الحية</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
   
        </div>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">صنف عطارة وبن</div>
          </div>
          <div class="stat">
            <div class="stat-number">100%</div>
            <div class="stat-label">طبيعي ونقي</div>
          </div>
          <div class="stat">
            <div class="stat-number">العبور</div>
            <div class="stat-label">الحي 2 محليه ٣٤ بجوار صيدليه محمد سامي</div>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img
          :src="heroImg"
          fetchpriority="high"
          decoding="async"
          width="520"
          height="520"
          alt="عطارة وبن أواب - بهارات وتوابل طبيعية وأعشاب"
          class="hero-img-element"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { assetUrl } from "../config/sheetConfig.js"
const heroImg = assetUrl("/images/attara_hero.webp")
</script>

<style scoped>
.hero-img-element {
  width: 100%;
  max-width: 520px;
  height: auto;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  border: 2px solid rgba(200, 169, 126, 0.3);
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hero-img-element:hover {
  transform: scale(1.02);
}
</style>
