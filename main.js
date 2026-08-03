/* ============================================================
   FURNISH & CO. — MAIN JS
   Navigation, theme, search, counters, accordions, toasts
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    if (preloader) setTimeout(() => preloader.classList.add('hide'), 300);
  });
  // fallback in case load already fired
  if (document.readyState === 'complete' && preloader) preloader.classList.add('hide');

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
  } else {
    document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
  }

  /* ---------- Sticky navbar + scroll progress ---------- */
  const navbar = document.querySelector('.navbar-main');
  const progressBar = document.querySelector('.scroll-progress');
  const backTop = document.querySelector('.back-to-top');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (backTop) backTop.classList.toggle('show', y > 500);
    if (progressBar) {
      const h = document.documentElement;
      const scrollPercent = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }
  }
  document.addEventListener('scroll', onScroll);
  onScroll();

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const mobileClose = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    mobileNav?.classList.add('open');
    navOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    navOverlay?.classList.remove('show');
    document.body.style.overflow = '';
  }
  burger?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  navOverlay?.addEventListener('click', () => { closeMobileNav(); closeSearch(); });

  /* ---------- Search popup ---------- */
  const searchTriggers = document.querySelectorAll('[data-search-trigger]');
  const searchPopup = document.querySelector('.search-popup');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-box input');

  function openSearch() {
    searchPopup?.classList.add('open');
    setTimeout(() => searchInput?.focus(), 200);
  }
  function closeSearch() { searchPopup?.classList.remove('open'); }
  searchTriggers.forEach(t => t.addEventListener('click', (e) => { e.preventDefault(); openSearch(); }));
  searchClose?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSearch(); closeMobileNav(); } });

  /* ---------- Theme toggle (dark/light) ---------- */
  const themeToggle = document.querySelectorAll('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('furnish-theme');
  if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.forEach(btn => btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('furnish-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('furnish-theme', 'dark');
    }
  }));

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        let cur = 0;
        const step = target / 60;
        const isDecimal = target % 1 !== 0;
        const tick = () => {
          cur += step;
          if (cur < target) {
            el.textContent = isDecimal ? cur.toFixed(1) : Math.ceil(cur);
            requestAnimationFrame(tick);
          } else {
            el.textContent = isDecimal ? target.toFixed(1) : target;
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      circle.style.width = circle.style.height = d + 'px';
      const rect = this.getBoundingClientRect();
      circle.style.left = (e.clientX - rect.left - d / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - d / 2) + 'px';
      circle.classList.add('ripple-circle');
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Product tabs (best selling / trending etc.) ---------- */
  document.querySelectorAll('.tabs-row').forEach(row => {
    row.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ---------- PD tabs (product details) ---------- */
  document.querySelectorAll('.pd-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.pd-tabs').parentElement;
      wrap.querySelectorAll('.pd-tabs button').forEach(b => b.classList.remove('active'));
      wrap.querySelectorAll('.pd-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      wrap.querySelector('#' + btn.dataset.tab)?.classList.add('active');
    });
  });

  /* ---------- PD gallery thumbs ---------- */
  document.querySelectorAll('.pd-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const main = document.querySelector('.pd-gallery-main img');
      if (main) main.src = thumb.src.replace('w=150', 'w=900');
      document.querySelectorAll('.pd-thumbs img').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  /* ---------- Image zoom on hover (product details) ---------- */
  const zoomImg = document.querySelector('.pd-gallery-main');
  if (zoomImg) {
    zoomImg.addEventListener('mousemove', function (e) {
      const img = this.querySelector('img');
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(1.6)';
    });
    zoomImg.addEventListener('mouseleave', function () {
      this.querySelector('img').style.transform = 'scale(1)';
    });
  }

  /* ---------- Quantity selector ---------- */
  document.querySelectorAll('.qty-selector').forEach(sel => {
    const input = sel.querySelector('input');
    sel.querySelector('.qty-minus')?.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || 1) - 1);
    });
    sel.querySelector('.qty-plus')?.addEventListener('click', () => {
      input.value = parseInt(input.value || 1) + 1;
    });
  });

  /* ---------- Shop view toggle (grid/list) ---------- */
  const viewButtons = document.querySelectorAll('.view-toggle button');
  const shopGrid = document.querySelector('.shop-grid');
  viewButtons.forEach(btn => btn.addEventListener('click', () => {
    viewButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    shopGrid?.classList.toggle('list-view', btn.dataset.view === 'list');
  }));

  /* ---------- Mobile filter toggle ---------- */
  document.querySelector('[data-filter-toggle]')?.addEventListener('click', () => {
    document.querySelector('.filter-box')?.classList.toggle('mobile-open');
  });

  /* ---------- Quick View modal ---------- */
  const qvModal = document.querySelector('.qv-modal-overlay');
  document.querySelectorAll('[data-quickview]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      qvModal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => {
    qvModal?.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- Wishlist toggle (heart icon) ---------- */
  document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (icon) icon.className = btn.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      showToast(btn.classList.contains('active') ? 'Added to Wishlist' : 'Removed from Wishlist',
        btn.classList.contains('active') ? 'Item saved for later.' : 'Item removed.');
    });
  });

  /* ---------- Toast helper (exposed globally) ---------- */
  window.showToast = function (title, msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i><div><b>${title}</b><span>${msg}</span></div>`;
    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  };

  /* ---------- Newsletter validation ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const val = input.value.trim();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (re.test(val)) {
        showToast('Subscribed!', 'Thanks for joining our newsletter.');
        input.value = '';
      } else {
        showToast('Invalid email', 'Please enter a valid email address.');
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  const contactForm = document.querySelector('#contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--color-error)';
      } else {
        field.style.borderColor = '';
      }
    });
    if (valid) {
      showToast('Message sent', "We'll get back to you within 24 hours.");
      contactForm.reset();
    } else {
      showToast('Missing fields', 'Please fill in all required fields.');
    }
  });

  /* ---------- Login / Register form (demo) ---------- */
  document.querySelectorAll('.auth-card form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Success', 'This is a front-end demo form.');
    });
  });

  /* ---------- Countdown timer (flash sale) ---------- */
  document.querySelectorAll('[data-countdown]').forEach(box => {
    const end = Date.now() + (parseInt(box.dataset.countdown) || 172800) * 1000;
    const dEl = box.querySelector('.cd-days'), hEl = box.querySelector('.cd-hours'),
      mEl = box.querySelector('.cd-mins'), sEl = box.querySelector('.cd-secs');
    function tick() {
      const dist = end - Date.now();
      if (dist < 0) return;
      const d = Math.floor(dist / 86400000);
      const h = Math.floor((dist % 86400000) / 3600000);
      const m = Math.floor((dist % 3600000) / 60000);
      const s = Math.floor((dist % 60000) / 1000);
      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ---------- Lazy loading images ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', function () { this.style.opacity = '0.4'; }, { once: true });
  });

  /* ---------- Typing effect ---------- */
  document.querySelectorAll('[data-typing]').forEach(el => {
    const words = el.dataset.typing.split(',');
    let wi = 0, ci = 0, deleting = false;
    function loop() {
      const word = words[wi];
      el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
      let speed = deleting ? 60 : 110;
      if (!deleting && ci === word.length + 1) { deleting = true; speed = 1400; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 400; }
      setTimeout(loop, speed);
    }
    loop();
  });

  /* ---------- Active nav link by URL ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav ul a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

});
