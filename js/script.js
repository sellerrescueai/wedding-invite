if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}

function initLanguage() {
  var savedLang = null;
  try {
    savedLang = localStorage.getItem('preferredLanguage');
  } catch (err) {
    console.warn("localStorage not available", err);
  }
  
  var popup = document.getElementById('language-popup');
  if (!popup) return;
  
  if (savedLang && window.translations && window.translations[savedLang]) {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
    applyLanguage(savedLang);
    startSite();
  } else {
    // Show popup
    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden', 'false');
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to buttons using for loop for older device compatibility
    var btns = popup.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      btn.addEventListener('click', function handleLangClick(e) {
        e.preventDefault();
        var lang = e.currentTarget.getAttribute('data-lang') || 'en';
        
        try {
          localStorage.setItem('preferredLanguage', lang);
        } catch (err) {
          console.warn("localStorage not available", err);
        }
        
        applyLanguage(lang);
        
        // Brutally remove the popup immediately
        if (popup && popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
        document.body.style.overflow = '';
        
        startSite();
      });
      // Fallback for tricky touch browsers
      btn.addEventListener('touchend', function handleLangTouch(e) {
        e.preventDefault();
        e.currentTarget.click();
      }, { passive: false });
    }
  }
}

function applyLanguage(lang) {
  if (!window.translations) return;
  var dict = window.translations[lang];
  if (!dict) return;
  
  document.documentElement.lang = lang; // Update html lang attribute
  
  var els = document.querySelectorAll('[data-i18n]');
  for (var j = 0; j < els.length; j++) {
    var el = els[j];
    var key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  }
}

function startSite() {
  initHeroAnim();
  initReveal();
  initPetals();
  initAudio();
  initCountdown();
  initRsvp();
  initEventsCarousel();
  initLightbox();
}

/* ── Hero stagger animations ── */
function initHeroAnim() {
  const els = document.querySelectorAll('.anim-up');
  els.forEach(el => {
    const d = parseInt(el.dataset.delay || 0);
    el.style.transitionDelay = `${d * 0.25 + 0.3}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
  });
}

/* ── Scroll Reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-el');
  if (!els.length) return;
  let idx = 0;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-el');
        let i = 0;
        siblings.forEach((s, si) => { if (s === entry.target) i = si; });
        entry.target.style.transitionDelay = `${i * 0.12}s`;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── Floating Petals ── */
function initPetals() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const c = document.getElementById('petals-container');
  if (!c) return;
  const colors = ['rgba(183,110,121,0.5)', 'rgba(212,175,55,0.5)', 'rgba(232,199,200,0.6)'];
  for (let i = 0; i < 7; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const sz = Math.random() * 5 + 10;
    const op = (Math.random() * 0.1 + 0.12).toFixed(2);
    const dr = (Math.random() - 0.5) * 80;
    p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}vw;top:-20px;background:${colors[i%3]};animation-duration:${Math.random()*10+15}s;animation-delay:-${Math.random()*15}s;--po:${op};--pd:${dr}px;`;
    c.appendChild(p);
  }
}

/* ── Audio ── */
function initAudio() {
  const btn = document.getElementById('audio-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;
  let playing = false;
  const playI = btn.querySelector('.music-icon--play');
  const pauseI = btn.querySelector('.music-icon--pause');
  btn.addEventListener('click', () => {
    if (playing) { audio.pause(); playI.style.display=''; pauseI.style.display='none'; }
    else { audio.play().catch(()=>{}); playI.style.display='none'; pauseI.style.display=''; }
    playing = !playing;
  });
}

/* ── Countdown ── */
function initCountdown() {
  if (typeof appConfig === 'undefined' || !appConfig.weddingDate) return;
  const t = new Date(appConfig.weddingDate).getTime();
  const $ = id => document.getElementById(id);
  const pad = n => n < 10 ? '0' + n : '' + n;
  function tick() {
    const d = t - Date.now();
    if (d < 0) return;
    $('days').textContent = pad(Math.floor(d/864e5));
    $('hours').textContent = pad(Math.floor(d%864e5/36e5));
    $('minutes').textContent = pad(Math.floor(d%36e5/6e4));
    $('seconds').textContent = pad(Math.floor(d%6e4/1e3));
  }
  tick(); setInterval(tick, 1000);
}

/* ── RSVP ── */
function initRsvp() {
  const btn = document.getElementById('rsvp-btn');
  if (!btn || typeof appConfig === 'undefined') return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.open(`https://wa.me/${appConfig.whatsappNumber}?text=${encodeURIComponent(appConfig.rsvpMessage)}`, '_blank');
  });
}

/* ── Events Carousel ── */
function initEventsCarousel() {
  const slides = document.querySelectorAll('.event-slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;
  let current = 0;
  let autoTimer;

  function goTo(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[i].classList.add('active');
    dots[i].classList.add('active');
    current = i;
  }

  function next() { goTo((current + 1) % slides.length); }

  dots.forEach(d => d.addEventListener('click', () => {
    goTo(parseInt(d.dataset.index));
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4000);
  }));

  // Touch swipe
  let startX = 0;
  const carousel = document.getElementById('eventsCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? Math.min(current+1, slides.length-1) : Math.max(current-1, 0));
        clearInterval(autoTimer);
        autoTimer = setInterval(next, 4000);
      }
    }, { passive: true });
  }

  autoTimer = setInterval(next, 4000);
}

/* ── Lightbox ── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (!lb) return;

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      lbImg.src = el.dataset.lightbox;
      lb.classList.add('active');
    });
  });

  function close() { lb.classList.remove('active'); lbImg.src = ''; }
  if (lbClose) lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
