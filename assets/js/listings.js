// ── Imali.biz — Listing pages: card builder, filter, sort ───────────────────
(function () {
  'use strict';

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function fmtRWF(n) {
    return 'RWF ' + Math.round(n || 0).toLocaleString();
  }

  var PIN_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 8 6 11 6 11S2.5 8 2.5 4.5A3.5 3.5 0 0 1 6 1z" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="6" cy="4.5" r="1" fill="currentColor"/></svg>';

  // ─── Card builder ─────────────────────────────────────────────────────────
  function buildCard(l, rootPath) {
    rootPath = rootPath || '';
    var cat   = l.listing_category || '';
    var price = l.price_rwf || 0;
    var loc   = [l.sector, l.district].filter(Boolean).join(', ') || l.province || '';

    // Photo
    var photoSrc = l.cover_photo || (l.photos && l.photos[0]) || '';
    var photoHtml = photoSrc
      ? '<img src="' + escHtml(photoSrc) + '" alt="' + escHtml(l.title) + '" loading="lazy">'
      : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-alt);color:var(--text-faint)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>';

    // Main badge
    var badgeColor = 'badge-green', badgeLabel = 'Property';
    if (cat === 'buy-land')  { badgeColor = 'badge-green';  badgeLabel = 'Land'; }
    if (cat === 'buy-home')  { badgeColor = 'badge-orange'; badgeLabel = 'Home'; }
    if (cat === 'invest' || cat === 'invest-full' || cat === 'invest-fractional') {
      badgeColor = 'badge-muted'; badgeLabel = 'Invest';
    }

    // Extra badges
    var extraBadges = '';
    if (l.off_plan) extraBadges += '<span class="badge badge-dark">Off-plan</span>';
    if (l.featured) extraBadges += '<span class="badge badge-orange">Featured</span>';
    (l.badges || []).forEach(function (b) {
      if (b !== 'Featured') extraBadges += '<span class="badge badge-dark">' + escHtml(b) + '</span>';
    });

    // Specs
    var specItems = [];
    if (cat === 'buy-land') {
      if (l.size_sqm > 0) specItems.push(l.size_sqm.toLocaleString() + ' m²');
      if (l.zone)         specItems.push('Zone ' + escHtml(l.zone));
    }
    if (cat === 'buy-home') {
      if (l.bedrooms)       specItems.push(l.bedrooms + ' Beds');
      if (l.bathrooms)      specItems.push(l.bathrooms + ' Baths');
      if (l.floor_area_sqm) specItems.push(l.floor_area_sqm + ' m²');
    }
    var isInvest = (cat === 'invest' || cat === 'invest-full' || cat === 'invest-fractional');
    if (isInvest) {
      var yld = l.yield_pct || l.projected_yield_pct;
      if (yld) specItems.push(yld + '% p.a.');
      if (l.min_invest_rwf) specItems.push('From ' + fmtRWF(l.min_invest_rwf));
      if (l.payout_schedule) specItems.push(escHtml(l.payout_schedule) + ' payouts');
    }
    var specsHtml = specItems.map(function (s) { return '<span class="prop-spec">' + s + '</span>'; }).join('');

    // Trust pills
    var ss = l.trust_seller   || 70;
    var ps = l.trust_property || 70;
    var slvl = ss >= 80 ? 'high' : ss >= 60 ? 'mid' : 'low';
    var plvl = ps >= 80 ? 'high' : ps >= 60 ? 'mid' : 'low';

    // Link
    var href = '#';
    if (cat === 'buy-land')  href = rootPath + 'pages/buy/land.html';
    if (cat === 'buy-home')  href = rootPath + 'pages/buy/homes.html';
    if (cat === 'invest-full' || (cat === 'invest' && l.invest_types && l.invest_types.indexOf('full') !== -1))
      href = rootPath + 'pages/invest/full-asset.html';
    if (cat === 'invest-fractional' || (cat === 'invest' && l.invest_types && l.invest_types.indexOf('fractional') !== -1 && l.invest_types.indexOf('full') === -1))
      href = rootPath + 'pages/invest/fractional.html';

    var allPhotos = (l.photos && l.photos.length) ? l.photos : (photoSrc ? [photoSrc] : []);
    return '<a href="' + escHtml(href) + '" class="prop-card" ' +
        'data-price="' + price + '" data-type="' + escHtml(cat) + '" data-location="' + escHtml((l.district || '').toLowerCase()) + '"' +
        ' data-photos="' + escHtml(JSON.stringify(allPhotos)) + '">' +
      '<div class="prop-card-photo">' +
        photoHtml +
        '<div class="prop-card-badges"><span class="badge ' + badgeColor + '">' + badgeLabel + '</span>' + extraBadges + '</div>' +
        '<button class="prop-card-save" aria-label="Save listing" onclick="event.preventDefault()">♡</button>' +
      '</div>' +
      '<div class="prop-card-body">' +
        '<div class="prop-card-price">' + fmtRWF(price) + '</div>' +
        '<div class="prop-card-title">' + escHtml(l.title || '') + '</div>' +
        (loc ? '<div class="prop-card-location">' + PIN_SVG + ' ' + escHtml(loc) + '</div>' : '') +
        (specsHtml ? '<div class="prop-card-specs">' + specsHtml + '</div>' : '') +
        '<div class="trust-row">' +
          '<span class="trust-pill" data-score="' + slvl + '"><span class="trust-pill-label">Seller Trust</span><span class="trust-pill-val">' + ss + '/100</span></span>' +
          '<span class="trust-pill" data-score="' + plvl + '"><span class="trust-pill-label">Property Trust</span><span class="trust-pill-val">' + ps + '/100</span></span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  // ─── Render a grid from an array of listings ──────────────────────────────
  function renderListings(gridEl, listings, rootPath) {
    if (!listings.length) {
      gridEl.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">No listings found — check back soon.</p>';
      updateResultCount(0);
      return;
    }
    gridEl.innerHTML = listings.map(function (l) { return buildCard(l, rootPath); }).join('');
    updateResultCount(listings.length);
  }

  // ─── Load a category page from Firestore ─────────────────────────────────
  function loadListingsPage(gridId, category, rootPath) {
    var grid = document.getElementById(gridId);
    if (!grid || !window.imaliPublicDB) return;
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Loading listings…</p>';

    var promise;
    if (category === 'invest-full' || category === 'invest-fractional') {
      promise = window.imaliPublicDB.getInvest().then(function (all) {
        return all.filter(function (l) {
          var c = l.listing_category;
          if (category === 'invest-full') {
            return c === 'invest-full' ||
              (c === 'invest' && l.invest_types && l.invest_types.indexOf('full') !== -1);
          } else {
            return c === 'invest-fractional' ||
              (c === 'invest' && l.invest_types && l.invest_types.indexOf('fractional') !== -1);
          }
        });
      });
    } else if (category === 'off-plan-buy' || category === 'off-plan-invest') {
      var group = category === 'off-plan-buy' ? 'buy' : 'invest';
      promise = window.imaliPublicDB.getOffPlan(group);
    } else {
      promise = window.imaliPublicDB.getLive(category);
    }

    promise.then(function (listings) {
      renderListings(grid, listings, rootPath);
      wireFilters();
      applySortListener(grid);
    }).catch(function (err) {
      grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Could not load listings — please refresh.</p>';
      console.error(err);
    });
  }

  // ─── Load featured listings (homepage) ───────────────────────────────────
  function loadFeaturedSection(gridId, limit, rootPath) {
    var grid = document.getElementById(gridId);
    if (!grid || !window.imaliPublicDB) return;
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Loading listings…</p>';

    window.imaliPublicDB.getFeatured().then(function (listings) {
      var shown = limit ? listings.slice(0, limit) : listings;
      if (!shown.length) {
        // Fall back to newest live listings
        return window.imaliPublicDB.getLive().then(function (all) {
          shown = all.slice(0, limit || 6);
          renderListings(grid, shown, rootPath);
        });
      }
      renderListings(grid, shown, rootPath);
    }).catch(function () {
      grid.innerHTML = '';
    });
  }

  // ─── Filter / sort (works on dynamically rendered cards too) ─────────────
  var PRICE_CEILINGS = { '20m':20000000,'50m':50000000,'100m':100000000,'250m':250000000,'500m':500000000 };

  function getSearchParams() {
    var p = new URLSearchParams(window.location.search);
    return { type: p.get('type')||'', location: p.get('location')||'', price: p.get('price')||'' };
  }

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

  function wireFilters() {
    document.querySelectorAll('[data-filter]').forEach(function (ctrl) {
      ctrl.removeEventListener('change', applyFilters);
      ctrl.addEventListener('change', applyFilters);
    });
    var params = getSearchParams();
    if (params.type || params.location || params.price) {
      ['type','location','price'].forEach(function (k) {
        var el = document.querySelector('[data-filter="' + k + '"]');
        if (el && params[k]) el.value = params[k];
      });
      filterCards(params);
    }
  }

  function applyFilters() {
    var params = {};
    document.querySelectorAll('[data-filter]').forEach(function (ctrl) { params[ctrl.dataset.filter] = ctrl.value; });
    filterCards(params);
  }

  function sortCards(grid, key, dir) {
    var cards = Array.from(grid.querySelectorAll('[data-price]'));
    cards.sort(function (a, b) {
      var av = parseInt(a.dataset[key]||'0',10), bv = parseInt(b.dataset[key]||'0',10);
      return dir === 'asc' ? av - bv : bv - av;
    });
    cards.forEach(function (c) { grid.appendChild(c); });
  }

  function applySortListener(grid) {
    var sortEl = document.getElementById('sort-select');
    if (!sortEl) return;
    sortEl.removeEventListener('change', sortEl._sortHandler||null);
    sortEl._sortHandler = function () {
      if (sortEl.value === 'price-asc')  sortCards(grid, 'price', 'asc');
      if (sortEl.value === 'price-desc') sortCards(grid, 'price', 'desc');
    };
    sortEl.addEventListener('change', sortEl._sortHandler);
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireFilters();
    var grid = document.querySelector('.listings-grid');
    if (grid) applySortListener(grid);
  });

  // ─── Off-plan invest project card builder ─────────────────────────────────
  var _NO_PHOTO = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-alt);color:var(--text-faint)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>';
  var _LOC_PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var USD = 1472;

  function _trustLabel(score) { return score >= 80 ? 'High' : score >= 60 ? 'Mid' : 'Low'; }
  function _trustLevel(score) { return score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'; }
  function _trustPills(l) {
    var ss = l.trust_seller || 70, ps = l.trust_property || 70;
    return '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.85rem">' +
      '<span class="trust-pill" data-score="' + _trustLevel(ss) + '">Developer Trust Score: ' + _trustLabel(ss) + '</span>' +
      '<span class="trust-pill" data-score="' + _trustLevel(ps) + '">Project Trust Score: ' + _trustLabel(ps) + '</span>' +
    '</div>';
  }

  // ─── Off-plan invest project card ─────────────────────────────────────────
  function buildOffPlanCard(l, rootPath) {
    var photoSrc  = l.cover_photo || (l.photos && l.photos[0]) || '';
    var loc       = [l.sector, l.district].filter(Boolean).join(', ');
    var yld       = l.projected_yield_pct || l.yield_pct || 0;
    var minInvest = l.min_invest_rwf || 0;
    var fullUnit  = l.price_rwf || 0;
    var fracAvail = l.fractions_available || 0;
    var fracTotal = l.total_fractions || 0;
    var fracTaken = fracTotal > 0 ? Math.max(0, fracTotal - fracAvail) : 0;
    var fillPct   = fracTotal > 0 ? Math.min(100, Math.round(fracTaken / fracTotal * 100)) : 0;
    var pct       = l.completion_pct || 0;
    var subType   = escHtml(l.unit_sub_type || l.property_sub_type || 'Investment');

    // Construction progress bar (uses .project-progress-top for modal label pickup)
    var progressHtml = pct > 0
      ? '<div class="project-progress-wrap" style="margin-bottom:0.85rem">' +
          '<div class="project-progress-top" style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-dim);margin-bottom:0.3rem"><span>Construction progress</span><span>' + pct + '%</span></div>' +
          '<div style="height:6px;background:var(--surface);border-radius:3px;overflow:hidden"><div class="project-progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>'
      : '';

    // Investor slots bar (separate class so modal picks up construction bar, not this one)
    var slotsHtml = fracTotal > 0
      ? '<div class="fraction-bar-wrap" style="margin:0.65rem 0">' +
          '<div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-dim);margin-bottom:0.3rem"><span>Investor slots</span><span>' + fracTaken + ' of ' + fracTotal + ' taken</span></div>' +
          '<div class="fraction-bar-bg"><div class="fraction-bar-fill" style="width:' + fillPct + '%"></div></div>' +
        '</div>'
      : '';

    var metaRows = '';
    if (minInvest)         metaRows += '<div><div class="project-meta-label">Min investment</div><div class="project-meta-val">' + fmtRWF(minInvest) + ' <span style="font-size:0.72em;color:var(--text-dim);font-weight:400">~$' + Math.round(minInvest / USD).toLocaleString() + '</span></div></div>';
    if (l.developer)       metaRows += '<div><div class="project-meta-label">Developer</div><div class="project-meta-val">' + escHtml(l.developer) + '</div></div>';
    if (l.completion_date) metaRows += '<div><div class="project-meta-label">Exit / Handover</div><div class="project-meta-val">' + escHtml(l.completion_date) + '</div></div>';
    if (fracTotal > 0)     metaRows += '<div><div class="project-meta-label">Fractions available</div><div class="project-meta-val">' + fracAvail + ' of ' + fracTotal + '</div></div>';
    if (l.payout_schedule) metaRows += '<div><div class="project-meta-label">Payout</div><div class="project-meta-val">' + escHtml(l.payout_schedule) + '</div></div>';
    if (fullUnit && fullUnit !== minInvest) metaRows += '<div><div class="project-meta-label">Full unit from</div><div class="project-meta-val">' + fmtRWF(fullUnit) + '</div></div>';

    var fracTextHtml = fracAvail > 0
      ? '<div class="project-fractions"><strong>' + fracAvail + ' investor slots available</strong>' + (minInvest ? ' — from ' + fmtRWF(minInvest) : '') + '</div>'
      : '';

    var allPhotos = (l.photos && l.photos.length) ? l.photos : (photoSrc ? [photoSrc] : []);
    return '<a href="#" class="project-card"' +
      ' data-price="' + (minInvest || fullUnit || 0) + '"' +
      ' data-type="' + escHtml(l.listing_category || '') + '"' +
      ' data-location="' + escHtml((l.district || '').toLowerCase()) + '"' +
      ' data-photos="' + escHtml(JSON.stringify(allPhotos)) + '">' +
      '<div class="project-card-photo">' +
        (photoSrc ? '<img src="' + escHtml(photoSrc) + '" alt="' + escHtml(l.title) + '" loading="lazy">' : _NO_PHOTO) +
        '<div class="project-card-badges">' +
          (yld ? '<span class="badge badge-green">' + yld + '% p.a.</span>' : '') +
          (pct > 0 ? '<span class="badge badge-blue">' + pct + '% Complete</span>' : '') +
          '<span class="badge badge-muted">' + subType + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="project-card-body">' +
        '<div class="project-card-name">' + escHtml(l.title || '') + '</div>' +
        (loc ? '<div class="project-card-location">' + _LOC_PIN + ' ' + escHtml(loc) + '</div>' : '') +
        progressHtml +
        (yld ? '<div style="text-align:center;padding:0.75rem 0 0.6rem;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:0.75rem"><div class="project-roi-val">' + yld + '%</div><div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.2rem">Projected annual return</div></div>' : '') +
        (metaRows ? '<div class="project-meta">' + metaRows + '</div>' : '') +
        slotsHtml +
        fracTextHtml +
        _trustPills(l) +
        '<span class="btn btn-primary btn-sm" style="width:100%;justify-content:center">View investment details</span>' +
      '</div>' +
    '</a>';
  }

  function loadOffPlanInvestPage(gridId, rootPath) {
    var grid = document.getElementById(gridId);
    if (!grid || !window.imaliPublicDB) return;
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Loading listings…</p>';
    return window.imaliPublicDB.getOffPlan('invest').then(function (listings) {
      if (!listings.length) {
        grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">No listings found — check back soon.</p>';
        updateResultCount(0);
        return listings;
      }
      grid.innerHTML = listings.map(function (l) { return buildOffPlanCard(l, rootPath); }).join('');
      updateResultCount(listings.length);
      return listings;
    }).catch(function (err) {
      grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Could not load listings — please refresh.</p>';
      console.error(err);
    });
  }

  // ─── Off-plan buy project card ─────────────────────────────────────────────
  function buildOffPlanBuyCard(l, rootPath) {
    var photoSrc  = l.cover_photo || (l.photos && l.photos[0]) || '';
    var loc       = [l.sector, l.district].filter(Boolean).join(', ');
    var pct       = l.completion_pct || 0;
    var totalU    = l.total_units || 0;
    var availU    = l.units_available || 0;
    var subType   = (l.unit_sub_type || l.property_sub_type || '').replace(/_/g, ' ');
    var subLabel  = subType ? escHtml(subType.charAt(0).toUpperCase() + subType.slice(1)) : '';

    var metaRows = '';
    metaRows += '<div><div class="project-meta-label">Starting from</div><div class="project-meta-val">' + fmtRWF(l.price_rwf || 0) + '</div></div>';
    if (l.completion_date) metaRows += '<div><div class="project-meta-label">Handover</div><div class="project-meta-val">' + escHtml(l.completion_date) + '</div></div>';
    if (totalU > 0)        metaRows += '<div><div class="project-meta-label">Units available</div><div class="project-meta-val">' + availU + ' of ' + totalU + '</div></div>';
    if (l.developer)       metaRows += '<div><div class="project-meta-label">Developer</div><div class="project-meta-val">' + escHtml(l.developer) + '</div></div>';

    var progressHtml = pct > 0
      ? '<div class="project-progress-wrap" style="margin-bottom:0.85rem">' +
          '<div class="project-progress-top" style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-dim);margin-bottom:0.3rem"><span>Construction progress</span><span>' + pct + '%</span></div>' +
          '<div style="height:6px;background:var(--surface);border-radius:3px;overflow:hidden"><div class="project-progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div>'
      : '';

    var allPhotosBuy = (l.photos && l.photos.length) ? l.photos : (photoSrc ? [photoSrc] : []);
    return '<a href="#" class="project-card"' +
      ' data-price="' + (l.price_rwf || 0) + '"' +
      ' data-type="' + escHtml(l.listing_category || '') + '"' +
      ' data-location="' + escHtml((l.district || '').toLowerCase()) + '"' +
      ' data-photos="' + escHtml(JSON.stringify(allPhotosBuy)) + '">' +
      '<div class="project-card-photo">' +
        (photoSrc ? '<img src="' + escHtml(photoSrc) + '" alt="' + escHtml(l.title) + '" loading="lazy">' : _NO_PHOTO) +
        '<div class="project-card-badges">' +
          (pct > 0 ? '<span class="badge badge-blue">' + pct + '% Complete</span>' : '') +
          (subLabel ? '<span class="badge badge-muted">' + subLabel + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="project-card-body">' +
        '<div class="project-card-name">' + escHtml(l.title || l.development_name || '') + '</div>' +
        (loc ? '<div class="project-card-location">' + _LOC_PIN + ' ' + escHtml(loc) + '</div>' : '') +
        progressHtml +
        '<div class="project-meta">' + metaRows + '</div>' +
        _trustPills(l) +
        '<span class="btn btn-primary btn-sm" style="width:100%;justify-content:center">View project details</span>' +
      '</div>' +
    '</a>';
  }

  function loadOffPlanBuyPage(gridId, rootPath) {
    var grid = document.getElementById(gridId);
    if (!grid || !window.imaliPublicDB) return;
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Loading listings…</p>';
    return window.imaliPublicDB.getOffPlan('buy').then(function (listings) {
      if (!listings.length) {
        grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">No listings found — check back soon.</p>';
        updateResultCount(0);
        return listings;
      }
      grid.innerHTML = listings.map(function (l) { return buildOffPlanBuyCard(l, rootPath); }).join('');
      updateResultCount(listings.length);
      return listings;
    }).catch(function (err) {
      grid.innerHTML = '<p style="color:var(--text-dim);font-size:0.9rem;padding:2rem 0;grid-column:1/-1;text-align:center">Could not load listings — please refresh.</p>';
      console.error(err);
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  window.imaliListings = {
    buildCard:              buildCard,
    renderListings:         renderListings,
    loadListingsPage:       loadListingsPage,
    loadFeaturedSection:    loadFeaturedSection,
    loadOffPlanInvestPage:  loadOffPlanInvestPage,
    buildOffPlanBuyCard:    buildOffPlanBuyCard,
    loadOffPlanBuyPage:     loadOffPlanBuyPage,
    filter:                 filterCards,
    sort:                   sortCards,
  };
})();
