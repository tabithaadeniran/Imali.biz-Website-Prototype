// ── Imali.biz Public DB — live listings reader for consumer pages ────────────
(function () {
  'use strict';

  var VER = '10.14.1';
  var CDN = 'https://www.gstatic.com/firebasejs/' + VER + '/';
  var CONFIG = {
    apiKey:            'AIzaSyBPYfPNzAGjMyMPuLP70pYak4yySefCOBE',
    authDomain:        'imali-biz.firebaseapp.com',
    projectId:         'imali-biz',
    storageBucket:     'imali-biz.firebasestorage.app',
    messagingSenderId: '462784037667',
    appId:             '1:462784037667:web:f2c30063b2dc10915f8296',
  };

  var _res, _rej;
  var _ready = new Promise(function (r, j) { _res = r; _rej = j; });

  function _load(src) {
    return new Promise(function (res, rej) {
      if (document.querySelector('script[src="' + src + '"]')) { res(); return; }
      var s = document.createElement('script');
      s.src = src; s.onload = res;
      s.onerror = function () { rej(new Error('Failed to load: ' + src)); };
      document.head.appendChild(s);
    });
  }

  _load(CDN + 'firebase-app-compat.js')
    .then(function () { return _load(CDN + 'firebase-firestore-compat.js'); })
    .then(function () {
      if (!window.firebase.apps.length) window.firebase.initializeApp(CONFIG);
      _res(window.firebase.firestore());
    })
    .catch(function (e) { console.error('[public-db]', e); _rej(e); });

  function _docs(snap) {
    var arr = [];
    snap.forEach(function (doc) { var d = doc.data(); d._docId = doc.id; arr.push(d); });
    return arr;
  }

  window.imaliPublicDB = {
    ready: _ready,

    // All live listings (optionally filtered by listing_category)
    getLive: function (category) {
      return _ready.then(function (db) {
        var q = db.collection('listings').where('status', '==', 'live');
        if (category) q = q.where('listing_category', '==', category);
        return q.get();
      }).then(_docs);
    },

    // Featured live listings
    getFeatured: function () {
      return _ready.then(function (db) {
        return db.collection('listings')
          .where('status', '==', 'live')
          .where('featured', '==', true)
          .get();
      }).then(_docs);
    },

    // Off-plan live listings, filtered by base category group ('buy' or 'invest')
    getOffPlan: function (categoryGroup) {
      return _ready.then(function (db) {
        return db.collection('listings')
          .where('status', '==', 'live')
          .where('off_plan', '==', true)
          .get();
      }).then(function (snap) {
        var arr = _docs(snap);
        if (categoryGroup === 'buy') {
          return arr.filter(function (l) {
            return l.listing_category === 'buy-land' || l.listing_category === 'buy-home';
          });
        }
        if (categoryGroup === 'invest') {
          return arr.filter(function (l) {
            return l.listing_category === 'invest' ||
              l.listing_category === 'invest-full' ||
              l.listing_category === 'invest-fractional';
          });
        }
        return arr;
      });
    },

    // All live invest listings — caller filters full vs fractional client-side
    getInvest: function () {
      return _ready.then(function (db) {
        return db.collection('listings')
          .where('status', '==', 'live')
          .where('listing_category', '==', 'invest')
          .get();
      }).then(function (snap) {
        // Also fetch legacy invest-full / invest-fractional categories
        var legacyFullQ  = db.collection('listings').where('status','==','live').where('listing_category','==','invest-full').get();
        var legacyFracQ  = db.collection('listings').where('status','==','live').where('listing_category','==','invest-fractional').get();
        var main = _docs(snap);
        return Promise.all([legacyFullQ, legacyFracQ]).then(function (snaps) {
          return main.concat(_docs(snaps[0]), _docs(snaps[1]));
        });
      });
    },
  };
})();
