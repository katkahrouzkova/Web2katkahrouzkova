/* =============================================
   KATKA HROUZKOVÁ — Main JS
   GSAP + ScrollTrigger animations,
   Nav, Language toggle, Carousel
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------- NAV -------- */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* -------- LANGUAGE TOGGLE -------- */
  const langBtns = document.querySelectorAll('.nav__lang button');
  const langContent = document.querySelectorAll('[data-lang]');

  function setLang(lang) {
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    langContent.forEach(el => {
      el.hidden = el.dataset.lang !== lang;
    });
    localStorage.setItem('katka-lang', lang);
  }

  langBtns.forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
  const savedLang = localStorage.getItem('katka-lang') || 'cz';
  setLang(savedLang);

  /* -------- TESTIMONIALS CAROUSEL -------- */
  const track = document.querySelector('.testimonials__track');
  const dots = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.querySelector('.testimonials__btn--prev');
  const nextBtn = document.querySelector('.testimonials__btn--next');
  const cards = document.querySelectorAll('.testimonial-card');

  if (track && cards.length) {
    let current = 0;
    let isDragging = false;
    let dragStartX = 0;
    let scrollStart = 0;

    function goTo(index) {
      current = Math.max(0, Math.min(index, cards.length - 1));
      const card = cards[current];
      const offset = card.offsetLeft - parseInt(getComputedStyle(track).paddingLeft);
      track.style.transform = `translateX(-${offset}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Drag to scroll
    track.addEventListener('mousedown', e => {
      isDragging = true; dragStartX = e.clientX;
      const style = window.getComputedStyle(track);
      const matrix = new DOMMatrix(style.transform);
      scrollStart = matrix.m41;
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      track.style.transform = `translateX(${scrollStart + e.clientX - dragStartX}px)`;
    });
    document.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      const delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 50) goTo(delta < 0 ? current + 1 : current - 1);
      else goTo(current);
    });

    // Touch
    track.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - dragStartX;
      if (Math.abs(delta) > 50) goTo(delta < 0 ? current + 1 : current - 1);
    });

    goTo(0);
  }

  /* -------- GSAP + ScrollTrigger -------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

      /* Hero entry */
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from('.hero__overline',  { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' })
        .from('.hero__title',     { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .from('.hero__sub',       { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from('.hero__ctas',      { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.hero__meta',      { opacity: 0, y: 12, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .from('.hero__image',     { opacity: 0, scale: 1.04, duration: 1.2, ease: 'power2.out' }, 0.1);

      /* Hero parallax */
      /* hero parallax disabled */

      /* Logos strip */
      gsap.from('.logos__item', {
        opacity: 0, y: 16, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.logos', start: 'top 90%' }
      });

      /* Intro section */
      gsap.from('.intro__image-wrap', {
        opacity: 0, x: -50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.intro', start: 'top 75%' }
      });
      gsap.from('.intro__image-card', {
        opacity: 0, y: 30, duration: 0.8, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: '.intro', start: 'top 75%' }
      });
      gsap.from('.intro__overline, .intro__title, .intro__lead, .intro__statement, .intro__list li', {
        opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.intro__content', start: 'top 80%' }
      });

      /* How cards */
      gsap.from('.how__card', {
        opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.how__grid', start: 'top 80%' }
      });
      gsap.from('.how__header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.how__header', start: 'top 85%' }
      });

      /* Service cards */
      gsap.from('.service-card', {
        opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.services__grid', start: 'top 80%' }
      });
      gsap.from('.services__header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.services__header', start: 'top 85%' }
      });

      /* About */
      gsap.from('.about__image-wrap', {
        opacity: 0, x: -50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about', start: 'top 75%' }
      });
      gsap.from('.about__content > *', {
        opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.about__content', start: 'top 80%' }
      });

      /* Stats counters */
      ScrollTrigger.create({
        trigger: '.stats',
        start: 'top 80%',
        onEnter: () => {
          document.querySelectorAll('.stat-item__num[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target);
            gsap.fromTo(el, { textContent: 0 }, {
              textContent: target,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                el.textContent = Math.round(parseFloat(el.textContent));
              }
            });
          });
          gsap.from('.stat-item', {
            opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out'
          });
        },
        once: true
      });

      /* Testimonials section header */
      gsap.from('.testimonials__header', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonials__header', start: 'top 85%' }
      });

      /* Certs */
      gsap.from('.cert-badge', {
        opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.certs', start: 'top 85%' }
      });

      /* CTA section */
      gsap.from('.cta-section__inner > *', {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
      });
    });
  }

  /* -------- SMOOTH ANCHOR SCROLL -------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// --- Active nav link ---
(function() {
  var p = window.location.pathname;
  document.querySelectorAll('.nav__links a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    var active = false;
    if (p.indexOf('blog') !== -1 && href.indexOf('blog') !== -1) active = true;
    if (p.indexOf('sluzby') !== -1 && (href.indexOf('sluzby') !== -1 || href.indexOf('#sluzby') !== -1)) active = true;
    if (p.indexOf('reference') !== -1 && href.indexOf('reference') !== -1) active = true;
    if (p.indexOf('o-mne') !== -1 && href.indexOf('o-mne') !== -1) active = true;
    if (p.indexOf('faq') !== -1 && href.indexOf('faq') !== -1) active = true;
    if (active) {
      a.style.fontWeight = '600';
      a.style.color = 'var(--terra)';
      a.style.opacity = '1';
    }
  });
})();
