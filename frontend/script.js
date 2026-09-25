/* =============================================
   PlantAI — script.js
   ============================================= */

/* ===== HEADER SCROLL STATE ===== */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== MOBILE NAV TOGGLE ===== */
(function () {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('nav--open', !open);
    toggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  });

  // Close on nav link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-label', 'Открыть меню');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && nav.classList.contains('nav--open')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav--open');
      toggle.setAttribute('aria-label', 'Открыть меню');
    }
  });
})();

/* ===== SCROLL REVEAL ===== */
/* Observer keyinroq, "ADD REVEAL CLASS" dan keyin chaqiriladi */
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  // Zaxira: 2 soniyadan keyin hali ko'rinmagan elementlarni majburan ko'rsat
  const fallback = setTimeout(() => {
    document.querySelectorAll('.js .reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 2000);

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    clearTimeout(fallback);
    return;
  }

  // prefers-reduced-motion: animatsiyasiz, hamma narsa darhol ko'rinadi
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('visible'));
    clearTimeout(fallback);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ===== INVEST BAR ANIMATION ===== */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const bars = document.querySelectorAll('.invest__bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animated');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ===== COUNT-UP ANIMATION ===== */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  // Har bir elementdan raqam va suffixni ajratib oladi
  // "96,97%" → { value: 96.97, suffix: '%', decimals: 2, comma: true }
  // "14"     → { value: 14, suffix: '', decimals: 0 }
  function parse(text) {
    const raw = text.trim();
    const suffix = raw.replace(/[\d\s,.]+/, '').trim(); // %, трлн, etc.
    const numStr = raw.replace(/[^\d,.]/g, '');
    if (!numStr) return null;
    // "96,97" → 96.97 (rus/uz format)
    const normalized = numStr.replace(',', '.');
    const value = parseFloat(normalized);
    if (isNaN(value)) return null;
    const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;
    return { value, suffix, decimals, useComma: numStr.includes(',') };
  }

  function format(val, decimals, useComma, suffix) {
    let str = val.toFixed(decimals);
    if (useComma) str = str.replace('.', ',');
    return str + (suffix ? suffix : '');
  }

  function animateCount(el, duration = 1600) {
    const info = parse(el.textContent);
    if (!info || info.value === 0) return;

    const start    = performance.now();
    const from     = 0;
    const to       = info.value;

    function ease(t) { return 1 - Math.pow(1 - t, 3); } // easeOutCubic

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = from + (to - from) * ease(progress);
      el.textContent = format(current, info.decimals, info.useComma, info.suffix);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = format(to, info.decimals, info.useComma, info.suffix);
    }
    requestAnimationFrame(step);
  }

  // Qaysi elementlarni animate qilamiz
  // .big-num olib tashlandi — grid-template-columns:auto bilan kenglik tebranadi
  const targets = [
    ...document.querySelectorAll('.stat__num'),
    ...document.querySelectorAll('.result-card__num'),
  ].filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ===== ACTIVE NAV LINK ===== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('nav__link--active'));
          const active = document.querySelector(`.nav__link[href="#${e.target.id}"]`);
          if (active) active.classList.add('nav__link--active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ===== CONTACT FORM — Formspree ===== */
const FORMSPREE_URL = 'https://formspree.io/f/xbglkknv';

(function () {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const status    = document.getElementById('formStatus');
  if (!form) return;

  function setError(input, errorId, msg) {
    const errorEl = document.getElementById(errorId);
    input.classList.toggle('error', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errorEl) errorEl.textContent = msg || '';
  }

  function validateName(val) {
    if (!val.trim()) return 'Пожалуйста, укажите ваше имя.';
    if (val.trim().length < 2) return 'Имя должно содержать минимум 2 символа.';
    return '';
  }

  function validateMessage(val) {
    if (!val.trim()) return 'Пожалуйста, напишите сообщение.';
    if (val.trim().length < 10) return 'Сообщение слишком короткое (минимум 10 символов).';
    return '';
  }

  const nameInput    = form.querySelector('#name');
  const messageInput = form.querySelector('#message');

  nameInput.addEventListener('blur', () =>
    setError(nameInput, 'nameError', validateName(nameInput.value))
  );
  messageInput.addEventListener('blur', () =>
    setError(messageInput, 'messageError', validateMessage(messageInput.value))
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot — bot bo'lsa, jim rad etiladi
    const hp = form.querySelector('#hp_website');
    if (hp && hp.value) return;

    const nameErr    = validateName(nameInput.value);
    const messageErr = validateMessage(messageInput.value);
    setError(nameInput, 'nameError', nameErr);
    setError(messageInput, 'messageError', messageErr);

    if (nameErr || messageErr) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    status.className   = 'form-status';
    status.textContent = '';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        status.textContent = '✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.';
        status.className   = 'form-status success';
        form.reset();
        form.querySelectorAll('.form-input').forEach(i => {
          i.classList.remove('error');
          i.removeAttribute('aria-invalid');
        });
        form.querySelectorAll('.form-error').forEach(el => (el.textContent = ''));
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка сервера');
      }
    } catch (err) {
      status.textContent =
        err.message === 'Failed to fetch'
          ? 'Нет соединения. Проверьте интернет и попробуйте ещё раз.'
          : 'Не удалось отправить. Напишите нам напрямую в Telegram: @abduaziz_dospanov_ai';
      status.className = 'form-status error-msg';
    } finally {
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
      status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
})();

/* ===== ADD REVEAL CLASS + INIT OBSERVER ===== */
(function () {
  const selectors = [
    '.hero__content',
    '.hero__visual',
    '.hero__stats',
    '.how__step',
    '.result-card',
    '.results__indev',
    '.market__diagram',
    '.market__legend-item',
    '.biz-card',
    '.timeline__item',
    '.team-card',
    '.invest__ask',
    '.invest__breakdown',
    '.invest__breakeven',
    '.contact__info',
    '.contact-form',
    '.section-label',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // CSS variable orqali stagger — transitionDelay bilan adashmaydi
      el.style.setProperty('--delay', `${Math.min(i * 0.07, 0.25)}s`);
    });
  });

  initReveal();
})();
