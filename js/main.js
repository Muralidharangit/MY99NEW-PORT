/* ==========================================================================
   MY99EXCH – page scripts
   ========================================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Site settings: add your real URLs and contact details here ----------
   Every button and link on the page reads from this object, so nothing points
   to a dead end:
   - "Register" and "Play" buttons go to these URLs. Until they're set, they open
     a message to support (WhatsApp if set, otherwise email).
   - Login, blog, "View all games", social and legal links stay hidden until
     they have a URL.
   - The WhatsApp button and chat links appear once `whatsapp` is set. */
const SITE = {
  registerUrl: '',
  loginUrl: '',
  gamesUrl: '',            // games lobby – used by "Play now" and "View all games"
  blogUrl: '',

  email: 'support@my99exch.com',
  phone: '+91 98765 43210',
  whatsapp: '',            // number with country code, digits only, e.g. '919876543210'

  legal: {
    terms: '',
    privacy: '',
    responsibleGaming: '', // until set, links open the responsible-gaming answer in the FAQ
    aml: '',
    kyc: '',
    disputes: '',
  },

  social: { facebook: '', x: '', instagram: '', youtube: '', telegram: '' },
};

/* ---------- Content ---------- */

// `img` shows a photo; without it the card uses the matching illustration from js/art.js
const GAMES = [
  { id: 'slots',       title: 'Slots',          art: 'slots',   icon: 'cherry',    cat: 'Casino',  badge: 'Popular', img: 'images/populargames/4.webp', desc: 'Spin classic and modern reels and chase the jackpot.' },
  { id: 'sports',      title: 'Sports Betting', art: 'sports',  icon: 'trophy',    cat: 'Sports',  badge: 'Popular', img: 'images/populargames/2.webp', desc: 'Back your favourite teams across popular sports.' },
  { id: 'live-games',  title: 'Live Casino',    art: 'live',    icon: 'tv',        cat: 'Live',    live: true,       img: 'images/populargames/1.webp', desc: 'Real dealers and real-time tables, streamed to you.' },
  { id: 'table-games', title: 'Casino Games',   art: 'cards',   icon: 'spade',     cat: 'Table',   img: 'images/populargames/3.webp', desc: 'Blackjack, baccarat and more table classics.' },
  { id: 'aviator',     title: 'Aviator',        art: 'aviator', icon: 'zap',       cat: 'Crash',   badge: 'New',     img: 'images/populargames/5.webp', desc: 'Watch the plane climb and cash out before it flies away.' },
];

// Player reviews – shown as an auto-sliding carousel. With an empty list the
// "coming soon" panel in index.html is shown instead.
// Format: { name: 'Rahul S.', role: 'VIP Player', text: 'Short review…', rating: 5, verified: true }
//
// ⚠ SAMPLE REVIEWS from the design mock-up – replace with genuine player reviews
//   before launch (set `verified: true` only for reviews you have confirmed).
const REVIEWS = [
  { name: 'Rahul Sharma', role: 'Regular Player',    rating: 5, text: "My99exch is the best platform I've used. Fast withdrawals, great support and amazing games!" },
  { name: 'Priya Verma',  role: 'VIP Player',        rating: 5, text: 'Super easy to use and the UPI withdrawal is really fast. I love the bonuses and live casino games!' },
  { name: 'Amit Kumar',   role: 'Sports Enthusiast', rating: 5, text: 'Very secure and trustworthy. The sports betting section is awesome. Highly recommended!' },
  { name: 'Rohit Sharma', role: 'Slots Player',      rating: 5, text: "Fast withdrawals and amazing games! My99exch is the best platform I've played on." },
  { name: 'Neha Verma',   role: 'Live Casino Fan',   rating: 5, text: 'Super smooth experience, great support team and lots of bonuses. Highly recommended!' },
  { name: 'Amit Patel',   role: 'Aviator Player',    rating: 5, text: 'Easy to use, secure and reliable. I love playing here!' },
];

/* ---------- Helpers ---------- */
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));
const initials = name => name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const setting = path => path.split('.').reduce((obj, key) => obj?.[key], SITE);
const isWebUrl = url => /^https?:\/\//i.test(url);

/* ---------- Render: games carousel ---------- */
document.getElementById('gamesGrid').innerHTML = GAMES.map((g, i) => `
  <li id="${g.id}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${GAMES.length}: ${escapeHtml(g.title)}">
    <article class="game-card group">
      <div class="game-media">
        <div class="art fallback-art" data-illustration="${g.art}"></div>
        ${g.img ? `<img src="${escapeHtml(g.img)}" alt="" loading="lazy" data-art>` : ''}
      </div>
      <div class="game-shade" aria-hidden="true"></div>

      <div class="game-top">
        ${g.live
          ? '<span class="game-badge game-badge-live"><span class="live-dot"></span> Live</span>'
          : g.badge ? `<span class="game-badge">${escapeHtml(g.badge)}</span>` : '<span></span>'}
        <span class="game-icon" aria-hidden="true"><i data-icon="${g.icon}"></i></span>
      </div>

      <div class="game-panel">
        <p class="game-cat">${escapeHtml(g.cat)}</p>
        <h3 class="game-title">${escapeHtml(g.title)}</h3>
        <p class="game-desc">${escapeHtml(g.desc)}</p>
        <a href="#join" data-route="play" class="btn btn-primary btn-sm game-play stretched">Play now<span class="sr-only">: ${escapeHtml(g.title)}</span> <i data-icon="arrow-right" class="icon-arrow"></i></a>
      </div>
    </article>
  </li>`).join('');

/* ---------- Render: reviews carousel (keeps the empty state when there are none) ---------- */
if (REVIEWS.length) {
  const cards = REVIEWS.map((r, i) => `
    <figure class="card review-card" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${REVIEWS.length}">
      <div class="flex items-center justify-between">
        ${r.rating ? `<span class="flex gap-0.5 text-gold" role="img" aria-label="Rated ${r.rating} out of 5">${'<i data-icon="star" class="h-4 w-4 fill-current"></i>'.repeat(r.rating)}</span>` : '<span></span>'}
        <i data-icon="quote" class="h-7 w-7 text-purple/70"></i>
      </div>
      <blockquote class="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-snow/90">“${escapeHtml(r.text)}”</blockquote>
      <figcaption class="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-surface font-display text-sm font-semibold text-gold">${escapeHtml(initials(r.name))}</span>
        <span>
          <span class="block font-display text-sm font-semibold">${escapeHtml(r.name)}</span>
          ${r.verified
            ? '<span class="flex items-center gap-1 text-xs text-muted"><i data-icon="badge-check" class="h-3.5 w-3.5 text-gold"></i> Verified player</span>'
            : r.role ? `<span class="block text-xs text-muted">${escapeHtml(r.role)}</span>` : ''}
        </span>
      </figcaption>
    </figure>`).join('');

  document.getElementById('reviewsList').innerHTML = `
    <div class="slider carousel reveal" data-carousel="review" aria-roledescription="carousel" aria-label="Player reviews">
      <div class="carousel-track" data-carousel-track tabindex="0" aria-live="off">${cards}</div>
    </div>
    <p class="mt-6 text-center">
      <a href="#join" data-route="feedback" class="link-arrow"><i data-icon="pen-line"></i> Share your feedback</a>
    </p>`;
}

/* ---------- Carousel controls (dots, pause/play, previous/next) ---------- */
document.querySelectorAll('[data-carousel]').forEach(root => {
  const noun = root.dataset.carousel;
  root.insertAdjacentHTML('beforeend', `
    <div class="slider-controls">
      <div class="slider-dots" role="group" aria-label="Choose a ${noun}" data-carousel-dots></div>
      <div class="flex items-center gap-2">
        <button type="button" class="icon-btn" data-carousel-toggle aria-label="Pause ${noun}s">
          <span data-when-playing><i data-icon="pause"></i></span>
          <span data-when-paused hidden><i data-icon="play"></i></span>
        </button>
        <button type="button" class="icon-btn" data-carousel-prev aria-label="Previous ${noun}"><i data-icon="chevron-left"></i></button>
        <button type="button" class="icon-btn" data-carousel-next aria-label="Next ${noun}"><i data-icon="chevron-right"></i></button>
      </div>
    </div>`);
});

/* ---------- Running marquee: repeat the items so the loop is seamless ---------- */
document.querySelectorAll('[data-marquee]').forEach(track => {
  const items = [...track.children];
  // Enough copies to cover wide screens; the CSS animation moves exactly one half
  const copies = 2;
  for (let c = 1; c < copies * 2; c++) {
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }
});

/* ---------- Artwork & icons (js/art.js, js/icons.js) ---------- */
renderIllustrations();
renderIcons();

/* ---------- Links: point every button at a real destination ---------- */
function supportUrl(message = '') {
  const number = SITE.whatsapp.replace(/\D/g, '');
  if (number) return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  return `mailto:${SITE.email}${message ? `?subject=${encodeURIComponent(message)}` : ''}`;
}

const ROUTES = {
  register: () => SITE.registerUrl || supportUrl('I would like to create a MY99EXCH account'),
  login: () => SITE.loginUrl,
  play: () => SITE.gamesUrl || ROUTES.register(),
  lobby: () => SITE.gamesUrl || '#games',
  games: () => SITE.gamesUrl,
  blog: () => SITE.blogUrl,
  support: () => supportUrl(),
  feedback: () => supportUrl('My MY99EXCH review'),
};

function setHref(el, url) {
  el.href = url;
  if (isWebUrl(url)) {
    el.target = '_blank';
    el.rel = 'noopener';
  } else {
    el.removeAttribute('target');
    el.removeAttribute('rel');
  }
}

// Hide a link with nowhere to go – or its list item, when the link is the only thing in it
function hideLink(el) {
  const item = el.closest('li');
  (item && item.querySelectorAll('a').length === 1 ? item : el).hidden = true;
}

document.querySelectorAll('[data-route]').forEach(el => {
  const url = ROUTES[el.dataset.route]?.();
  url ? setHref(el, url) : hideLink(el);
});

document.querySelectorAll('[data-legal]').forEach(el => {
  const url = SITE.legal[el.dataset.legal] || el.dataset.fallback;
  if (url) setHref(el, url);
  else if (el.classList.contains('text-link')) el.replaceWith(el.textContent); // inline mention: keep the words
  else hideLink(el);
});

document.querySelectorAll('[data-social]').forEach(el => {
  const url = SITE.social[el.dataset.social];
  url ? setHref(el, url) : (el.hidden = true);
});
const socialLinks = document.getElementById('socialLinks');
if (socialLinks && !socialLinks.querySelector('a:not([hidden])')) socialLinks.hidden = true;

document.querySelectorAll('[data-contact]').forEach(el => {
  const type = el.dataset.contact;
  const value = SITE[type];
  if (!value) return hideLink(el);
  if (type === 'email') setHref(el, `mailto:${value}`);
  if (type === 'phone') setHref(el, `tel:${value.replace(/[^\d+]/g, '')}`);
  if (type === 'whatsapp') setHref(el, supportUrl());
  const label = el.querySelector('[data-contact-label]');
  if (label) label.textContent = value;
});

document.querySelectorAll('[data-requires]').forEach(el => {
  if (!setting(el.dataset.requires)) el.hidden = true;
});

/* ---------- Images: show a real image when it loads, otherwise keep the illustration ---------- */
function whenImage(img, onLoad, onError) {
  if (img.complete) return img.naturalWidth ? onLoad() : onError();
  img.addEventListener('load', onLoad, { once: true });
  img.addEventListener('error', onError, { once: true });
}
document.querySelectorAll('img[data-art]').forEach(img =>
  whenImage(img, () => img.parentElement.classList.add('has-img'), () => img.remove()));

/* ---------- Hero slider ---------- */
function initSlider(root) {
  if (!root) return;
  const viewport = root.querySelector('[data-slider-viewport]');
  const slides = [...root.querySelectorAll('[data-slide]')];
  const dots = [...root.querySelectorAll('[data-slide-dot]')];
  const toggle = root.querySelector('[data-slider-toggle]');
  const counter = root.querySelector('[data-slide-current]');
  const DURATION = 7000;
  let index = 0;
  let playing = !reduceMotion;
  let holding = false;      // pointer over the slider or keyboard focus inside it
  let timer = null;
  let remaining = DURATION;
  let startedAt = 0;

  root.style.setProperty('--slide-duration', `${DURATION}ms`);

  // Autoplay timer – pauses and resumes in step with the progress bar on the active dot
  function startTimer() {
    clearTimeout(timer);
    timer = null;
    if (!playing || holding) return;
    startedAt = performance.now();
    timer = setTimeout(() => go(index + 1, 1), remaining);
  }
  function stopTimer() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    remaining = Math.max(0, remaining - (performance.now() - startedAt));
  }
  function setHolding(state) {
    if (holding === state) return;
    holding = state;
    root.classList.toggle('is-holding', state);
    state ? stopTimer() : startTimer();
  }

  function render() {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
  }

  function go(next, dir = next > index ? 1 : -1) {
    const target = (next + slides.length) % slides.length;
    if (target === index) return;
    viewport.style.setProperty('--dir', dir);
    slides.forEach((slide, i) => slide.classList.toggle('is-out', i === index));
    index = target;
    render();
    remaining = DURATION;
    startTimer();
  }

  function setPlaying(state) {
    playing = state;
    root.classList.toggle('is-paused', !state);
    viewport.setAttribute('aria-live', state ? 'off' : 'polite');
    toggle.setAttribute('aria-label', state ? 'Pause slideshow' : 'Play slideshow');
    toggle.querySelector('[data-when-playing]').hidden = !state;
    toggle.querySelector('[data-when-paused]').hidden = state;
    state ? startTimer() : stopTimer();
  }

  // Pause while a mouse is over the slider or keyboard focus is inside it
  root.addEventListener('pointerenter', e => e.pointerType === 'mouse' && setHolding(true));
  root.addEventListener('pointerleave', e => e.pointerType === 'mouse' && setHolding(false));
  root.addEventListener('focusin', () => setHolding(true));
  root.addEventListener('focusout', e => !root.contains(e.relatedTarget) && setHolding(false));

  root.querySelector('[data-slider-prev]').addEventListener('click', () => go(index - 1, -1));
  root.querySelector('[data-slider-next]').addEventListener('click', () => go(index + 1, 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  toggle.addEventListener('click', () => setPlaying(!playing));

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go(index + 1, 1);
    if (e.key === 'ArrowLeft') go(index - 1, -1);
  });

  // Touch swipe (vertical scrolling still works thanks to touch-action: pan-y)
  let startX = null;
  let startY = 0;
  viewport.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    startX = e.clientX;
    startY = e.clientY;
  });
  viewport.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  viewport.addEventListener('pointercancel', () => { startX = null; });

  if (reduceMotion) {
    root.classList.add('is-static');
    toggle.hidden = true;
    viewport.setAttribute('aria-live', 'polite');
  } else {
    setPlaying(true);
  }
  render();
}
initSlider(document.querySelector('[data-slider]'));

/* ---------- Card carousels (games, reviews): auto-slide card by card, swipe/scroll friendly ---------- */
function initCarousel(root) {
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const cards = [...track.children];
  const dotsWrap = root.querySelector('[data-carousel-dots]');
  const toggle = root.querySelector('[data-carousel-toggle]');
  const noun = root.dataset.carousel;
  const DURATION = 4500;
  let index = 0;
  let dots = [];
  let playing = !reduceMotion;
  let holding = false;     // pointer over the carousel, focus inside it, or a touch in progress
  let onScreen = false;    // only auto-slide while the section is visible
  let timer = null;

  root.style.setProperty('--slide-duration', `${DURATION}ms`);

  // Distance between two cards, and the last position the track can scroll to
  const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const lastIndex = () => Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step()));

  function buildDots() {
    const count = lastIndex() + 1;
    root.classList.toggle('is-single', count < 2);
    if (dots.length === count) return;
    dotsWrap.innerHTML = Array.from({ length: count }, (_, i) =>
      `<button type="button" class="slider-dot" aria-label="Show ${noun} ${i + 1}"><span class="slider-dot-track"><span class="slider-dot-fill"></span></span></button>`).join('');
    dots = [...dotsWrap.children];
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  }

  function markActive() {
    dots.forEach((dot, i) => {
      // Re-adding the class restarts the progress bar on the active dot
      dot.classList.remove('is-active');
      dot.removeAttribute('aria-current');
      if (i === index) {
        void dot.offsetWidth;
        dot.classList.add('is-active');
        dot.setAttribute('aria-current', 'true');
      }
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (!playing || holding || !onScreen || document.hidden || lastIndex() === 0) return;
    timer = setTimeout(() => go(index >= lastIndex() ? 0 : index + 1), DURATION);
  }

  function go(next) {
    index = Math.max(0, Math.min(next, lastIndex()));
    track.scrollTo({ left: index * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    markActive();
    schedule();
  }

  // Keep the dots in sync when people swipe or scroll the track themselves
  let scrollEnd = null;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollEnd);
    scrollEnd = setTimeout(() => {
      const current = Math.min(Math.round(track.scrollLeft / step()), lastIndex());
      if (current !== index) {
        index = current;
        markActive();
        schedule();
      }
    }, 120);
  }, { passive: true });

  function setHolding(state) {
    if (holding === state) return;
    holding = state;
    root.classList.toggle('is-holding', state);
    if (!state) markActive(); // restart the progress bar with the fresh timer
    schedule();
  }

  function setPlaying(state) {
    playing = state;
    root.classList.toggle('is-paused', !state);
    track.setAttribute('aria-live', state ? 'off' : 'polite');
    toggle.setAttribute('aria-label', state ? `Pause ${noun}s` : `Play ${noun}s`);
    toggle.querySelector('[data-when-playing]').hidden = !state;
    toggle.querySelector('[data-when-paused]').hidden = state;
    if (state) markActive();
    schedule();
  }

  root.addEventListener('pointerenter', e => e.pointerType === 'mouse' && setHolding(true));
  root.addEventListener('pointerleave', e => e.pointerType === 'mouse' && setHolding(false));
  root.addEventListener('focusin', () => setHolding(true));
  root.addEventListener('focusout', e => !root.contains(e.relatedTarget) && setHolding(false));
  track.addEventListener('touchstart', () => setHolding(true), { passive: true });
  track.addEventListener('touchend', () => setTimeout(() => setHolding(false), 600), { passive: true });

  root.querySelector('[data-carousel-prev]').addEventListener('click', () => go(index <= 0 ? lastIndex() : index - 1));
  root.querySelector('[data-carousel-next]').addEventListener('click', () => go(index >= lastIndex() ? 0 : index + 1));
  toggle.addEventListener('click', () => setPlaying(!playing));

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    root.classList.toggle('is-offscreen', !onScreen);
    if (onScreen) markActive();
    schedule();
  }, { threshold: 0.35 }).observe(root);
  document.addEventListener('visibilitychange', schedule);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); go(index); }, 150);
  });

  buildDots();
  if (reduceMotion) {
    root.classList.add('is-static');
    toggle.hidden = true;
    track.setAttribute('aria-live', 'polite');
  } else {
    setPlaying(true);
  }
  markActive();
}
document.querySelectorAll('[data-carousel]').forEach(initCarousel);

/* ---------- FAQ accordion ---------- */
function initAccordion(root) {
  if (!root) return;
  const setOpen = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-trigger').setAttribute('aria-expanded', String(open));
  };
  root.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-trigger').addEventListener('click', () => setOpen(item, !item.classList.contains('is-open')));
  });

  // Links such as #faq-payments open their answer
  const openFromHash = hash => {
    const item = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (item?.classList.contains('faq-item')) setOpen(item, true);
  };
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#faq-"]');
    if (link) openFromHash(link.getAttribute('href'));
  });
  window.addEventListener('hashchange', () => openFromHash(location.hash));
  openFromHash(location.hash);
}
initAccordion(document.querySelector('[data-accordion]'));

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  if (open) document.getElementById('navbar').classList.remove('is-hidden');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuBtn.querySelector('[data-menu-open]').hidden = open;
  menuBtn.querySelector('[data-menu-close]').hidden = !open;
}
menuBtn.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    setMenu(false);
    menuBtn.focus();
  }
});
window.matchMedia('(min-width: 1280px)').addEventListener('change', e => e.matches && setMenu(false));

/* ---------- Smooth scrolling (Lenis) ----------
   Weighted, eased wheel scrolling on desktop; phones keep native touch scrolling.
   Skipped entirely for visitors who prefer reduced motion. */
const lenis = !reduceMotion && window.Lenis
  ? new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out expo
      smoothWheel: true,
      wheelMultiplier: 1,
    })
  : null;

if (lenis) {
  const raf = time => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

/* ---------- In-page links: glide to the section, clear of the sticky header ---------- */
const HEADER_OFFSET = 88;

function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -HEADER_OFFSET, duration: 1.3 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const id = link.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();

  if (id === 'home') {
    scrollToTarget(0);
  } else {
    // Items inside a carousel: scroll the page to the carousel, then slide to the item
    const track = target.closest('[data-carousel-track]');
    scrollToTarget(track ? track.closest('section') || track : target);
    if (track) {
      track.scrollTo({ left: target.offsetLeft - track.firstElementChild.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  history.pushState(null, '', `#${id}`);
  // Move keyboard focus with the scroll, without a second jump
  if (!target.matches('a, button, input, [tabindex]')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

/* ---------- Scroll effects: header, progress bar, back-to-top, parallax ---------- */
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
const parallaxItems = reduceMotion ? [] : [...document.querySelectorAll('[data-parallax]')];
const driftItems = reduceMotion ? [] : [...document.querySelectorAll('[data-drift]')];
let lastY = window.scrollY;
let scrollTicking = false;

function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;

  navbar.classList.toggle('scrolled', y > 50);
  // Hide the header while reading down the page, bring it back on any scroll up
  const menuOpen = document.getElementById('mobileMenu')?.classList.contains('open');
  if (y > 320 && y > lastY + 4 && !menuOpen) navbar.classList.add('is-hidden');
  else if (y < lastY - 4 || y <= 320) navbar.classList.remove('is-hidden');
  lastY = y;

  if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  if (toTop) toTop.classList.toggle('is-visible', y > vh * 0.9);

  // Parallax: drift relative to the element's distance from the viewport centre
  parallaxItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > vh + 200) return;
    const offset = (rect.top + rect.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax);
    el.style.translate = `0 ${offset.toFixed(1)}px`;
  });

  // Background wordmarks drift sideways as their section passes through
  driftItems.forEach(el => {
    const rect = el.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh) return;
    const offset = (rect.top + rect.height / 2 - vh / 2) * parseFloat(el.dataset.drift);
    el.style.translate = `${offset.toFixed(1)}px 0`;
  });

  scrollTicking = false;
}

const requestScrollFrame = () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
};
if (lenis) lenis.on('scroll', requestScrollFrame);
else window.addEventListener('scroll', requestScrollFrame, { passive: true });
window.addEventListener('resize', requestScrollFrame, { passive: true });
onScroll();

/* ---------- Active nav link on scroll ---------- */
const navLinks = document.querySelectorAll('[data-nav]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.dataset.nav === entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => sectionObserver.observe(s));

/* ---------- Scroll reveal ----------
   Elements fade in as they enter the viewport. data-reveal="left|right|zoom"
   sets the direction (default: up). Siblings in the same row are staggered.
   After the animation the class is removed so hover effects work normally. */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    obs.unobserve(el);
    const delay = parseFloat(el.style.transitionDelay) || 0;
    setTimeout(() => {
      // Make sure the entrance has fully finished (e.g. if the tab was in the background)
      el.getAnimations?.({ subtree: true }).forEach(a => a instanceof CSSTransition && a.finish());
      el.classList.remove('reveal', 'visible');
      el.style.transitionDelay = '';
    }, 900 + delay);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  const order = Math.min(siblings.indexOf(el), 4);
  if (order > 0) el.style.transitionDelay = `${order * 110}ms`;
  revealObserver.observe(el);
});

/* ---------- Card spotlight: follows the pointer on [data-spotlight] cards ---------- */
document.querySelectorAll('[data-spotlight]').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- Count-up for verified figures marked with data-count ---------- */
const counters = document.querySelectorAll('[data-count]');
if (counters.length && !reduceMotion) {
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countObserver.observe(el));
}

/* ---------- Footer year ---------- */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();
