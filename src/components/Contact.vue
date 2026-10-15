<template>
  <section id="contact">
    <div class="container">
      <div class="section-head reveal">
        <h2 class="section-title">زورونا أو <span>تواصلوا معنا</span></h2>
        <p class="section-sub">
          نسعد بخدمتكم في المحل أو عبر الهاتف في أي وقت خلال ساعات العمل.
        </p>
      </div>
      <div class="contact-grid">
        <div class="reveal">
          <div class="contact-items">
            <a href="tel:+201037268585" class="contact-item">
              <div class="ci-icon green">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div>
                <div class="ci-label">اتصل بنا</div>
                <div class="ci-value">01037268585</div>
              </div>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbDwOv9GZNCixuMYdS3n"
              class="contact-item"
              target="_blank"
            >
              <div
                class="ci-icon green"
                style="background: #fde9e9; color: #25d366"
              >
                <i class="fab fa-whatsapp"></i>
              </div>
              <div>
                <div class="ci-label">واتساب</div>
                <div class="ci-value">لمتابعة العروض على جروب الواتساب</div>
              </div>
            </a>
            <div class="contact-item">
              <div class="ci-icon red">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <div class="ci-label">العنوان</div>
                <div class="ci-value">
                  مدينة العبور - الحي الثامن - خان العمار
                </div>
              </div>
            </div>
            <div class="contact-item">
              <div class="ci-icon gold"><i class="fas fa-clock"></i></div>
              <div>
                <div class="ci-label">ساعات العمل</div>
                <div class="ci-value">
                  طول الأسبوع من الساعة 7 صباحاً إلى 8 مساءً
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="map-wrap reveal">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2863.267222285462!2d31.47339057556146!3d30.245870574822845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDE0JzQ1LjEiTiAzMcKwMjgnMzMuNSJF!5e1!3m2!1sen!2seg!4v1792030536914!5m2!1sen!2seg"
            width="100%"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="موقع محل عطاره وبن-أواب على الخريطة"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* ─── CONTACT ────────────────────────────────────── */
#contact {
  background: var(--off-white);
  margin: 30px 0;
}
.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 24px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--white);
  border-radius: 16px;
  padding: 18px 22px;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  text-decoration: none;
}
.contact-item:hover {
  transform: translateX(-4px);
  box-shadow: var(--shadow-md);
}
.ci-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.ci-icon.green {
  background: var(--green-light);
  color: var(--green-dark);
}
.ci-icon.red {
  background: var(--red-light);
  color: var(--red-soft);
}
.ci-icon.gold {
  background: #fff8e1;
  color: var(--gold);
}

.ci-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  margin-bottom: 3px;
}
.ci-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-800);
}

.map-wrap {
  border-radius: 24px;
  overflow: hidden;
  height: 380px;
  box-shadow: var(--shadow-md);
  border: 3px solid var(--green-light);
}
.map-wrap iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
