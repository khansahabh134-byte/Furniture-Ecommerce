/* ============================================================
   FURNISH & CO. — SLIDER JS (Swiper initializations)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Swiper === 'undefined') return;

  /* Testimonials slider */
  if (document.querySelector('.testimonial-slider')) {
    new Swiper('.testimonial-slider', {
      slidesPerView: 1,
      spaceBetween: 26,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.testi-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  /* Related products slider */
  if (document.querySelector('.related-slider')) {
    new Swiper('.related-slider', {
      slidesPerView: 1.15,
      spaceBetween: 18,
      navigation: { nextEl: '.related-next', prevEl: '.related-prev' },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 20 },
        900: { slidesPerView: 3, spaceBetween: 22 },
        1200: { slidesPerView: 4, spaceBetween: 24 }
      }
    });
  }

  /* Blog related / brand logos handled via CSS marquee, no swiper needed */

  /* Product gallery slider (mobile) */
  if (document.querySelector('.pd-gallery-slider')) {
    new Swiper('.pd-gallery-slider', {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: { el: '.pd-gallery-pagination', clickable: true }
    });
  }
});
