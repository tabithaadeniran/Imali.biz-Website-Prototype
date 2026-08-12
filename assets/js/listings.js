/**
 * listings.js — Filter, sort, and render property listing cards.
 * Loaded only on listing pages (buy/land/homes, invest, off-plan-*).
 *
 * Currently uses data-* attributes on existing HTML cards.
 * When a database is connected, replace readListingsFromDOM()
 * with fetchListings(apiUrl) and call renderListings(data).
 */

(function () {
  'use strict';

  /* ─── Read URL params from homepage search ── */
  function getSearchParams() {
    var p = new URLSearchParams(window.location.search);
    return {
      type:     p.get('type')     || '',
      location: p.get('location') || '',
      price:    p.get('price')    || ''
    };
  }

  /* ─── Price ceiling from shorthand ─────────── */
  var PRICE_CEILINGS = {
    '20m':  20000000,
    '50m':  50000000,
    '100m': 100000000,
    '250m': 250000000,
    '500m': 500000000
  };

  /* ─── Filter cards in the DOM ───────────────── */
  function filterCards(params) {
    var cards = document.querySelectorAll('[data-price]');
    var visible = 0;
    cards.forEach(function (card) {
      var matchType     = !params.type     || card.dataset.type     === params.type;
      var matchLocation = !params.location || card.dataset.location === params.location;
      var ceiling       = PRICE_CEILINGS[params.price];
      var matchPrice    = !ceiling         || parseInt(card.dataset.price, 10) <= ceiling;
      var show = matchType && matchLocation && matchPrice;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    updateResultCount(visible);
  }

  function updateResultCount(n) {
    var el = document.getElementById('result-count');
    if (el) el.textContent = n + ' listing' + (n !== 1 ? 's' : '') + ' found';
  }

  /* ─── Wire up filter controls ────────────────── */
  function wireFilters() {
    var controls = document.querySelectorAll('[data-filter]');
    controls.forEach(function (ctrl) {
      ctrl.addEventListener('change', applyFilters);
    });
  }

  function applyFilters() {
    var params = {};
    document.querySelectorAll('[data-filter]').forEach(function (ctrl) {
      params[ctrl.dataset.filter] = ctrl.value;
    });
    filterCards(params);
  }

  /* ─── Sort cards ────────────────────────────── */
  function sortCards(grid, key, dir) {
    var cards = Array.from(grid.querySelectorAll('[data-price]'));
    cards.sort(function (a, b) {
      var av = parseInt(a.dataset[key] || '0', 10);
      var bv = parseInt(b.dataset[key] || '0', 10);
      return dir === 'asc' ? av - bv : bv - av;
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }

  /* ─── Init ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var params = getSearchParams();
    if (params.type || params.location || params.price) {
      /* Pre-populate filter controls with search params */
      ['type', 'location', 'price'].forEach(function (key) {
        var el = document.querySelector('[data-filter="' + key + '"]');
        if (el && params[key]) el.value = params[key];
      });
      filterCards(params);
    }

    wireFilters();

    /* Sort dropdown */
    var sortEl = document.getElementById('sort-select');
    var grid   = document.querySelector('.listings-grid');
    if (sortEl && grid) {
      sortEl.addEventListener('change', function () {
        var val = sortEl.value;
        if (val === 'price-asc')  sortCards(grid, 'price', 'asc');
        if (val === 'price-desc') sortCards(grid, 'price', 'desc');
      });
    }
  });

  /* ─── Public API (for database hookup later) ─ */
  window.imaliListings = {
    filter: filterCards,
    sort:   sortCards
  };

})();
