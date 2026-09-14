/* ============================================================
   AURA BROADBEACH — scroll choreography
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- 1. Smooth scroll (Lenis) ---------- */
  function startLenis() {
    if (reduce || !window.Lenis) return null;
    var lenis = new window.Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -70 });
      });
    });
    return lenis;
  }
  var lenis = startLenis();

  /* ---------- 2. Hero pin progress + nav logo hand-off ---------- */
  var hero = document.querySelector('.hero');
  var nav = document.getElementById('nav');
  var navLogo = document.querySelector('.nav-logo');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle('stuck', y > 40);

    if (hero && !reduce) {
      var h = hero.offsetHeight || window.innerHeight;
      var p = Math.min(1, Math.max(0, y / h));
      root.style.setProperty('--hp', p.toFixed(4));
      /* logo hands off from hero to nav once the hero is half gone */
      if (navLogo && !navLogo.classList.contains('always')) {
        var n = Math.min(1, Math.max(0, (p - 0.34) / 0.3));
        root.style.setProperty('--navlogo', n.toFixed(4));
      }
    }
    ticking = false;
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }

  if (lenis) lenis.on('scroll', request);
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);

  /* pages without a hero keep the nav logo on permanently */
  if (!hero && navLogo) navLogo.classList.add('always');
  onScroll();

  /* ---------- 3. Reveals, with stagger ---------- */
  var els = document.querySelectorAll('.rv, .lift');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (e) { e.classList.add('on'); });
  } else {
    /* stagger siblings that enter together */
    var groups = {};
    els.forEach(function (e) {
      var key = e.parentElement ? (e.parentElement.dataset.k || (e.parentElement.dataset.k = Math.random().toString(36).slice(2))) : 'x';
      groups[key] = groups[key] || 0;
      e.style.setProperty('--d', (groups[key] * 90) + 'ms');
      groups[key]++;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
})();
