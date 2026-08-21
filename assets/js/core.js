/**
 * core.js — Shared JS for every Imali.biz page.
 * Handles: custom cursor, theme toggle, scroll reveals,
 * nav scroll-state, nav dropdowns, mobile drawer,
 * nav + footer injection (path-aware).
 *
 * HOW TO USE ON EACH PAGE:
 *   1. Add <div id="site-nav"></div> near top of <body>
 *   2. Add <div id="site-footer"></div> near bottom of <body>
 *   3. Add <script src="PATH/assets/js/core.js"></script>
 *      where PATH = relative path from the page to the site root
 *      e.g. for root/index.html: src="./assets/js/core.js"
 *           for pages/buy/index.html: src="../../assets/js/core.js"
 *   4. Set data-root on the <script> tag (same relative root path):
 *      <script src="..." data-root="./"></script>      (root page)
 *      <script src="..." data-root="../../"></script>  (2-deep page)
 */

(function () {
  'use strict';

  /* ─── Bootstrap Icons (injected once, covers all pages) ── */
  var _bi = document.createElement('link');
  _bi.rel  = 'stylesheet';
  _bi.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
  document.head.appendChild(_bi);

  /* ─── Path resolution ─────────────────────────────── */
  const scriptEl = document.currentScript ||
    document.querySelector('script[src*="core.js"]');
  const ROOT = scriptEl ? (scriptEl.dataset.root || './') : './';
  function r(path) { return ROOT + path; }

  /* ─── Theme ───────────────────────────────────────── */
  function getTheme() {
    return localStorage.getItem('imali-theme') || 'light';
  }
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('imali-theme', t);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
  }
  applyTheme(getTheme());

  /* ─── NAV HTML ────────────────────────────────────── */
  function buildNav() {
    return `
<nav class="main-nav" id="main-nav">
  <div class="nav-inner">
    <a href="${r('index.html')}" class="nav-logo" aria-label="Imali.biz home">
      <img src="${r('assets/images/logo.png')}" alt="Imali.biz" />
    </a>

    <ul class="nav-links" role="list">

      <!-- BUY -->
      <li class="nav-item">
        <a href="${r('pages/buy/index.html')}" class="nav-link">
          Buy
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <ul class="nav-dropdown" role="list">
          <div class="drop-group">
            <li><a href="${r('pages/buy/land.html')}">
              <span class="drop-icon"><i class="bi bi-tree-fill"></i></span>
              <div><div class="drop-label">Browse Land</div><div class="drop-sub">Plots by size, zone &amp; location</div></div>
            </a></li>
            <li><a href="${r('pages/buy/homes.html')}">
              <span class="drop-icon"><i class="bi bi-house-fill"></i></span>
              <div><div class="drop-label">Homes &amp; Apartments</div><div class="drop-sub">Ready-to-move properties</div></div>
            </a></li>
          </div>
          <div class="drop-group">
            <li><a href="${r('pages/off-plan-buy/index.html')}">
              <span class="drop-icon"><i class="bi bi-buildings"></i></span>
              <div><div class="drop-label">Off-Plan Projects</div><div class="drop-sub">Reserve before completion</div></div>
            </a></li>
          </div>
        </ul>
      </li>

      <!-- SELL -->
      <li class="nav-item">
        <a href="${r('pages/sell/index.html')}" class="nav-link">
          Sell
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <ul class="nav-dropdown" role="list">
          <div class="drop-group">
            <li><a href="${r('pages/sell/index.html')}">
              <span class="drop-icon"><i class="bi bi-clipboard-fill"></i></span>
              <div><div class="drop-label">List Your Land</div><div class="drop-sub">Reach qualified buyers fast</div></div>
            </a></li>
            <li><a href="${r('pages/sell/list-property.html')}">
              <span class="drop-icon"><i class="bi bi-house-heart-fill"></i></span>
              <div><div class="drop-label">List a Property</div><div class="drop-sub">Houses &amp; apartments</div></div>
            </a></li>
          </div>
          <div class="drop-group">
            <li><a href="${r('pages/sell/agents.html')}">
              <span class="drop-icon"><i class="bi bi-people-fill"></i></span>
              <div><div class="drop-label">Agent Portal</div><div class="drop-sub">Manage multiple listings</div></div>
            </a></li>
          </div>
        </ul>
      </li>

      <!-- INVEST -->
      <li class="nav-item">
        <a href="${r('pages/invest/index.html')}" class="nav-link">
          Invest
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <ul class="nav-dropdown" role="list">
          <div class="drop-group">
            <li><a href="${r('pages/invest/full-asset.html')}">
              <span class="drop-icon"><i class="bi bi-bank2"></i></span>
              <div><div class="drop-label">Full Asset Deals</div><div class="drop-sub">Complete ownership from day one</div></div>
            </a></li>
            <li><a href="${r('pages/invest/fractional.html')}">
              <span class="drop-icon"><i class="bi bi-pie-chart-fill"></i></span>
              <div><div class="drop-label">Fractional Ownership</div><div class="drop-sub">Start from a lower entry point</div></div>
            </a></li>
          </div>
          <div class="drop-group">
            <li><a href="${r('pages/off-plan-invest/index.html')}">
              <span class="drop-icon"><i class="bi bi-graph-up-arrow"></i></span>
              <div><div class="drop-label">Off-Plan (Investor)</div><div class="drop-sub">Lock in pre-launch returns</div></div>
            </a></li>
            <li><a href="${r('pages/invest/calculator.html')}">
              <span class="drop-icon"><i class="bi bi-calculator-fill"></i></span>
              <div><div class="drop-label">Returns Calculator</div><div class="drop-sub">Model your ROI before committing</div></div>
            </a></li>
          </div>
        </ul>
      </li>

    </ul>

    <div class="nav-right">
      <button class="theme-btn" id="theme-btn" aria-label="Toggle theme" title="Toggle dark/light mode">🌙</button>
      <a href="${r('auth/login.html')}" class="nav-signin" data-auth-hide>Sign In</a>
      <a href="${r('auth/register.html')}" class="btn btn-primary btn-sm">Get Started</a>
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<!-- Mobile drawer -->
<div class="nav-mobile-drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
  <a href="${r('pages/buy/index.html')}"    class="mobile-nav-link">Buy</a>
  <a href="${r('pages/buy/land.html')}"     class="mobile-nav-sub">→ Browse Land</a>
  <a href="${r('pages/buy/homes.html')}"    class="mobile-nav-sub">→ Homes &amp; Apartments</a>
  <a href="${r('pages/off-plan-buy/index.html')}" class="mobile-nav-sub">→ Off-Plan (Buyer)</a>
  <a href="${r('pages/sell/index.html')}"   class="mobile-nav-link">Sell</a>
  <a href="${r('pages/sell/index.html')}"   class="mobile-nav-sub">→ List Your Land</a>
  <a href="${r('pages/sell/list-property.html')}" class="mobile-nav-sub">→ List a Property</a>
  <a href="${r('pages/invest/index.html')}" class="mobile-nav-link">Invest</a>
  <a href="${r('pages/invest/full-asset.html')}"  class="mobile-nav-sub">→ Full Asset</a>
  <a href="${r('pages/invest/fractional.html')}"  class="mobile-nav-sub">→ Fractional</a>
  <a href="${r('pages/off-plan-invest/index.html')}" class="mobile-nav-sub">→ Off-Plan (Investor)</a>
  <div style="margin-top:auto;display:flex;gap:0.75rem;padding-top:2rem">
    <a href="${r('auth/login.html')}"    class="btn btn-outline" style="flex:1;justify-content:center">Sign In</a>
    <a href="${r('auth/register.html')}" class="btn btn-primary" style="flex:1;justify-content:center">Get Started</a>
  </div>
</div>`;
  }

  /* ─── FOOTER HTML ──────────────────────────────────── */
  function buildFooter() {
    const year = new Date().getFullYear();
    return `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="${r('assets/images/logo.png')}" alt="Imali.biz" style="filter:brightness(0) invert(1); opacity:0.85;">
        <p class="footer-tagline">Rwanda's property marketplace — connecting buyers, sellers, and investors through transparent, data-driven transactions.</p>
      </div>
      <div>
        <div class="footer-col-title">Buy</div>
        <ul class="footer-links">
          <li><a href="${r('pages/buy/land.html')}">Browse Land</a></li>
          <li><a href="${r('pages/buy/homes.html')}">Homes &amp; Apartments</a></li>
          <li><a href="${r('pages/off-plan-buy/index.html')}">Off-Plan Projects</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Sell &amp; Invest</div>
        <ul class="footer-links">
          <li><a href="${r('pages/sell/index.html')}">List Your Land</a></li>
          <li><a href="${r('pages/sell/list-property.html')}">List a Property</a></li>
          <li><a href="${r('pages/invest/index.html')}">Invest</a></li>
          <li><a href="${r('pages/invest/fractional.html')}">Fractional Ownership</a></li>
          <li><a href="${r('pages/off-plan-invest/index.html')}">Off-Plan (Investor)</a></li>
          <li><a href="${r('pages/invest/calculator.html')}">Returns Calculator</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="${r('index.html')}">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} Imali.biz. All rights reserved. Kigali, Rwanda.</span>
      <span class="footer-live"><span class="status-dot"></span>Platform in development</span>
      <span>Licensed real estate marketplace</span>
    </div>
  </div>
</footer>`;
  }

  /* ─── Inject nav + footer ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    const navSlot = document.getElementById('site-nav');
    if (navSlot) navSlot.outerHTML = buildNav();

    const footerSlot = document.getElementById('site-footer');
    if (footerSlot) footerSlot.outerHTML = buildFooter();

    init();
  });

  /* ─── Init everything after injection ─────────────── */
  function init() {
    setupCursor();
    setupNavScroll();
    setupThemeBtn();
    setupHamburger();
    setupScrollReveal();
    setupAuthVisibility();
    setupListingModal();
    applyTheme(getTheme()); // re-apply so theme-btn icon is set
  }

  /* ─── Cursor ──────────────────────────────────────── */
  function setupCursor() {
    const dot  = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
  }

  /* ─── Nav scroll state ────────────────────────────── */
  function setupNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    // Pages without a full-bleed hero always show a solid nav
    const alwaysSolid = !!(
      document.querySelector('.page-header') ||
      document.querySelector('.auth-card')
    );
    function update() {
      nav.classList.toggle('scrolled', alwaysSolid || window.scrollY > 20);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─── Theme button ────────────────────────────────── */
  function setupThemeBtn() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
    applyTheme(getTheme());
  }

  /* ─── Mobile hamburger ────────────────────────────── */
  function setupHamburger() {
    const btn    = document.getElementById('nav-hamburger');
    const drawer = document.getElementById('nav-drawer');
    if (!btn || !drawer) return;
    btn.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Scroll reveal ───────────────────────────────── */
  function setupScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ─── Auth visibility ─────────────────────────────── */
  function setupAuthVisibility() {
    const user = null; // swap for: JSON.parse(localStorage.getItem('imali_user'))
    if (user) {
      document.querySelectorAll('[data-auth-hide]').forEach(function (el) { el.style.display = 'none'; });
      document.querySelectorAll('[data-auth-show]').forEach(function (el) { el.style.removeProperty('display'); });
    } else {
      document.querySelectorAll('[data-auth-show]').forEach(function (el) { el.style.display = 'none'; });
    }
  }

  /* ─── Auth guard (for protected CTAs) ─────────────── */
  window.imaliAuth = {
    isLoggedIn: function () { return false; }, // swap for real session check
    requireLogin: function (redirectAfter) {
      if (!this.isLoggedIn()) {
        window.location.href = ROOT + 'auth/login.html?next=' + encodeURIComponent(redirectAfter || window.location.href);
        return false;
      }
      return true;
    }
  };

  /* ─── Property listing modal ──────────────────────── */
  function setupListingModal() {
    var overlay = document.createElement('div');
    overlay.className = 'listing-modal-overlay';
    overlay.id = 'listing-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Property details');
    overlay.innerHTML =
      '<div class="listing-modal" id="lm-inner">' +
        '<div class="modal-photo-col" id="lm-photo-col">' +
          '<img id="lm-img" src="" alt="">' +
          '<div class="modal-photo-badges" id="lm-badges"></div>' +
          '<button class="modal-close" id="lm-close" aria-label="Close">✕</button>' +
          '<button class="gallery-nav-btn gallery-prev" id="lm-prev" aria-label="Previous photo">&#8249;</button>' +
          '<button class="gallery-nav-btn gallery-next" id="lm-next" aria-label="Next photo">&#8250;</button>' +
          '<div class="gallery-counter" id="lm-counter"></div>' +
          '<div class="gallery-strip" id="lm-strip"></div>' +
        '</div>' +
        '<div class="modal-body-col">' +
          '<div id="lm-content"></div>' +
          '<div class="modal-actions">' +
            '<a href="' + r('auth/register.html') + '" class="btn btn-primary">Enquire now</a>' +
            '<button class="btn btn-outline" onclick="window.imaliAuth.requireLogin(window.location.href)">♡ Save</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    // ── Gallery state ──
    var _photos = [];
    var _photoIdx = 0;

    function setPhoto(idx) {
      if (!_photos.length) return;
      _photoIdx = Math.max(0, Math.min(_photos.length - 1, idx));
      document.getElementById('lm-img').src = _photos[_photoIdx];
      var show = _photos.length > 1;
      document.getElementById('lm-prev').style.display    = show ? '' : 'none';
      document.getElementById('lm-next').style.display    = show ? '' : 'none';
      document.getElementById('lm-counter').style.display = 'none';
      // update filmstrip active thumb
      var strip = document.getElementById('lm-strip');
      var thumbs = strip ? strip.querySelectorAll('.gallery-strip-thumb') : [];
      thumbs.forEach(function (t, i) { t.classList.toggle('active', i === _photoIdx); });
      if (thumbs[_photoIdx]) thumbs[_photoIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    function initGallery(card) {
      _photos = []; _photoIdx = 0;
      try {
        var parsed = JSON.parse(card.dataset.photos || '[]');
        if (Array.isArray(parsed)) _photos = parsed.filter(Boolean);
      } catch (e) {}
      var fallbackImg = card.querySelector('img');
      if (!_photos.length && fallbackImg && fallbackImg.src) _photos = [fallbackImg.src];
      // build filmstrip
      var strip = document.getElementById('lm-strip');
      strip.innerHTML = '';
      if (_photos.length > 1) {
        _photos.forEach(function (src, i) {
          var btn = document.createElement('button');
          btn.className = 'gallery-strip-thumb' + (i === 0 ? ' active' : '');
          btn.setAttribute('aria-label', 'Photo ' + (i + 1));
          var thumb = document.createElement('img');
          thumb.src = src; thumb.alt = '';
          btn.appendChild(thumb);
          btn.addEventListener('click', function (e) { e.stopPropagation(); setPhoto(i); });
          strip.appendChild(btn);
        });
        strip.style.display = 'flex';
      } else {
        strip.style.display = 'none';
      }
      setPhoto(0);
    }

    document.getElementById('lm-prev').addEventListener('click', function (e) { e.stopPropagation(); setPhoto(_photoIdx - 1); });
    document.getElementById('lm-next').addEventListener('click', function (e) { e.stopPropagation(); setPhoto(_photoIdx + 1); });
    document.getElementById('lm-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape')     closeModal();
      if (e.key === 'ArrowLeft')  setPhoto(_photoIdx - 1);
      if (e.key === 'ArrowRight') setPhoto(_photoIdx + 1);
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('.prop-card-save')) return;
      var propCard    = e.target.closest('.prop-card');
      var projectCard = e.target.closest('.project-card');
      if (propCard)    { e.preventDefault(); populateProp(propCard);       openModal(); }
      if (projectCard) { e.preventDefault(); populateProject(projectCard); openModal(); }
    });

    function openModal() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function locIcon() {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    }

    function populateProp(card) {
      initGallery(card);
      var img    = card.querySelector('.prop-card-photo img');
      var badges = card.querySelector('.prop-card-badges');
      document.getElementById('lm-img').alt               = img    ? img.alt   : '';
      document.getElementById('lm-badges').innerHTML      = badges ? badges.innerHTML : '';

      var price   = card.querySelector('.prop-card-price, .invest-price-main');
      var usd     = card.querySelector('.invest-price-usd');
      var title   = card.querySelector('.prop-card-title');
      var loc     = card.querySelector('.prop-card-location');
      var specs   = card.querySelectorAll('.prop-card-specs .prop-spec');
      var yieldEl = card.querySelector('.invest-yield-val');
      var trusts  = card.querySelectorAll('.trust-pill');

      var h = '';
      if (price)  h += '<div class="modal-price">'     + price.textContent.trim() + '</div>';
      if (usd)    h += '<div class="modal-price-usd">' + usd.textContent.trim()   + '</div>';
      if (title)  h += '<div class="modal-name">'      + title.textContent.trim() + '</div>';
      if (loc)    h += '<div class="modal-location">'  + locIcon() + loc.textContent.trim() + '</div>';
      if (specs.length) {
        h += '<div class="modal-divider"></div><div class="modal-specs">';
        specs.forEach(function (s) { h += '<span class="modal-spec">' + s.textContent.trim() + '</span>'; });
        h += '</div>';
      }
      if (yieldEl) {
        h += '<div class="modal-yield"><span class="modal-yield-label">Estimated rental yield</span><span class="modal-yield-val">' + yieldEl.textContent.trim() + '</span></div>';
      }
      if (trusts.length) {
        h += '<div class="modal-divider"></div><div class="modal-trust-row">';
        trusts.forEach(function (t) {
          h += '<span class="trust-pill" data-score="' + (t.dataset.score || '') + '">' + t.innerHTML + '</span>';
        });
        h += '</div>';
      }
      document.getElementById('lm-content').innerHTML = h;
    }

    function populateProject(card) {
      initGallery(card);
      var img    = card.querySelector('.project-card-photo img');
      var badges = card.querySelector('.project-card-badges');
      document.getElementById('lm-img').alt               = img    ? img.alt   : '';
      document.getElementById('lm-badges').innerHTML      = badges ? badges.innerHTML : '';

      var nameEl     = card.querySelector('.project-card-name');
      var locEl      = card.querySelector('.project-card-location');
      var roiEl      = card.querySelector('.project-roi-val');
      var metaItems  = card.querySelectorAll('.project-meta > div');
      var progFill   = card.querySelector('.project-progress-fill, .fraction-bar-fill');
      var progSpans  = card.querySelectorAll('.project-progress-top span, .fraction-bar-top span');
      var fracEl     = card.querySelector('.project-fractions');
      var fracFrom   = card.querySelector('.frac-from-val');
      var fracTotal  = card.querySelector('.frac-total-val');
      var trusts     = card.querySelectorAll('.trust-pill');

      var h = '';

      if (fracFrom) {
        h += '<div class="modal-price">'     + fracFrom.textContent.trim()  + '</div>';
        if (fracTotal) h += '<div class="modal-price-usd">Total asset: ' + fracTotal.textContent.trim() + '</div>';
      }
      if (nameEl) h += '<div class="modal-name">'     + nameEl.textContent.trim() + '</div>';
      if (locEl)  h += '<div class="modal-location">' + locIcon() + locEl.textContent.trim() + '</div>';

      if (roiEl) {
        h += '<div class="modal-divider"></div>';
        h += '<div class="modal-roi-val">'   + roiEl.textContent.trim() + '</div>';
        h += '<div class="modal-roi-label">Projected annual return</div>';
      }

      if (progFill && progSpans.length) {
        var w = progFill.style.width || '0%';
        h += '<div class="modal-progress-wrap">'
          + '<div class="modal-progress-label"><span>' + (progSpans[0] ? progSpans[0].textContent.trim() : '') + '</span><span>' + (progSpans[1] ? progSpans[1].textContent.trim() : w) + '</span></div>'
          + '<div class="modal-progress-bg"><div class="modal-progress-fill" style="width:' + w + '"></div></div>'
          + '</div>';
      }

      if (metaItems.length) {
        h += '<div class="modal-meta-grid">';
        metaItems.forEach(function (item) {
          var lbl = item.querySelector('.project-meta-label');
          var val = item.querySelector('.project-meta-val');
          if (lbl && val) h += '<div><div class="modal-meta-label">' + lbl.textContent.trim() + '</div><div class="modal-meta-val">' + val.textContent.trim() + '</div></div>';
        });
        h += '</div>';
      }

      if (fracEl) {
        h += '<div class="modal-divider"></div><div style="font-size:0.85rem;color:var(--text-dim)">' + fracEl.textContent.trim() + '</div>';
      }

      if (trusts.length) {
        h += '<div class="modal-divider"></div><div class="modal-trust-row">';
        trusts.forEach(function (t) {
          h += '<span class="trust-pill" data-score="' + (t.dataset.score || '') + '">' + t.innerHTML + '</span>';
        });
        h += '</div>';
      }
      document.getElementById('lm-content').innerHTML = h;
    }
  }

})();
