// ── Imali.biz Public Site — Listings Firestore Layer ─────────────────────────
// Manages the `listings` collection in the shared `imali-biz` Firebase project.
// Used by admin/add-listing.html · admin/manage-listings.html

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
    .catch(function (e) { console.error('[listingsDB] Boot failed:', e); _rej(e); });

  function _strip(data) {
    var out = Object.assign({}, data);
    delete out._docId;
    return out;
  }

  window.listingsDB = {
    ready: _ready,

    // All listings including archived, newest first
    getAll: function () {
      return _ready.then(function (db) {
        return db.collection('listings').orderBy('created_at', 'desc').get();
      }).then(function (snap) {
        var arr = [];
        snap.forEach(function (doc) { var d = doc.data(); d._docId = doc.id; arr.push(d); });
        return arr;
      });
    },

    // Only live listings (for public pages)
    getLive: function () {
      return _ready.then(function (db) {
        return db.collection('listings').where('status', '==', 'live').get();
      }).then(function (snap) {
        var arr = [];
        snap.forEach(function (doc) { var d = doc.data(); d._docId = doc.id; arr.push(d); });
        return arr;
      });
    },

    getById: function (id) {
      return _ready.then(function (db) {
        return db.collection('listings').doc(id).get();
      }).then(function (doc) {
        if (!doc.exists) return null;
        var d = doc.data(); d._docId = doc.id; return d;
      });
    },

    save: function (data) {
      var p = _strip(data);
      p.status = p.status || 'live';
      p.created_at = window.firebase.firestore.FieldValue.serverTimestamp();
      p.updated_at = p.created_at;
      return _ready.then(function (db) { return db.collection('listings').add(p); });
    },

    update: function (id, data) {
      var p = _strip(data);
      p.updated_at = window.firebase.firestore.FieldValue.serverTimestamp();
      return _ready.then(function (db) {
        return db.collection('listings').doc(id).set(p, { merge: true });
      });
    },

    archive: function (id) {
      return _ready.then(function (db) {
        return db.collection('listings').doc(id).update({
          status: 'archived',
          archived_at: window.firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    },

    restore: function (id) {
      return _ready.then(function (db) {
        return db.collection('listings').doc(id).update({
          status: 'live',
          updated_at: window.firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    },

    // Reads from _config collection shared with the internal site
    getConfig: function (key) {
      return _ready.then(function (db) {
        return db.collection('_config').doc(key).get();
      }).then(function (doc) {
        return doc.exists ? doc.data() : null;
      });
    },
  };
})();
