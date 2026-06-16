/**
 * shared/firebase-init.js
 * Firebase initialization, Firestore helpers, and sync badge.
 *
 * Globals exposed:
 *   _auth, _db, _provider, _uid, _syncing, _unsubSnap,
 *   _ref(), _write(), _read(), _badge(), _gate()
 *
 * Expects Firebase compat SDK loaded before this script.
 */

/* ---------- Firebase config (single source of truth) ---------- */
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAE9VvmxCorzJ8d1MUAZds6TyQC1gw67ME",
  authDomain:        "investments-page.firebaseapp.com",
  projectId:         "investments-page",
  storageBucket:     "investments-page.firebasestorage.app",
  messagingSenderId: "964948881361",
  appId:             "1:964948881361:web:2801b8127489d953717af0"
};

var _auth = null, _db = null, _provider = null;
var _unsubSnap = null;
var _syncing   = false;
var _uid       = null;

try {
  if (typeof firebase === 'undefined') throw new Error('Firebase not loaded');
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

  _auth     = firebase.auth();
  _db       = firebase.firestore();
  _provider = new firebase.auth.GoogleAuthProvider();
  _provider.setCustomParameters({ prompt: "select_account" });

  window.IS_FIREBASE_CONFIGURED = true;
} catch(e) {
  console.warn('Firebase init failed:', e.message);
  window._firebaseFailed = true;
}

/* ---------- Firestore helpers ---------- */

function _ref(uid, col) {
  return _db.collection("users").doc(uid)
            .collection("portfolio").doc(col);
}

function _write(uid, col, data) {
  if (!uid) return;
  _badge("loading");
  _ref(uid, col).set(
    { data: data, uid: uid, ts: new Date().toISOString() },
    { merge: true }
  )
  .then(function() { _badge("synced"); })
  .catch(function(e) {
    console.error("Firestore write error [" + col + "]:", e.code, e.message);
    if (e.code === "permission-denied") {
      _badge("rules");
    } else {
      _badge("error");
    }
  });
}

function _read(uid, col) {
  return _ref(uid, col).get().then(function(snap) {
    if (!snap.exists) return null;
    var d = snap.data();
    if (d.uid && d.uid !== uid) return null;
    return d.data || null;
  }).catch(function(e) { console.warn("read:", e.message); return null; });
}

/* ---------- Sync badge ---------- */

function _badge(state) {
  var labels = {
    loading: "syncing...",
    synced:  "synced",
    error:   "error - check console",
    rules:   "permission denied - set Firestore rules",
    offline: "offline"
  };
  var colors = {
    loading: "#4ecdc4",
    synced:  "var(--green)",
    error:   "var(--red)",
    rules:   "var(--orange)",
    offline: "var(--orange)"
  };
  var b = document.getElementById("sync-badge");
  var m = document.getElementById("mob-sync-status");
  var t = labels[state] || state;
  var k = colors[state] || "var(--orange)";
  if (b) { b.textContent = t; b.style.color = k; b.style.display = "flex"; }
  if (m) { m.textContent = t; m.style.color = k; }
}

/* ---------- Auth gate ---------- */

function _gate(show) {
  var g = document.getElementById("auth-gate") || document.getElementById("login-banner");
  if (g) g.style.display = show ? "flex" : "none";
  var appDiv = document.getElementById("app");
  if (appDiv && appDiv.dataset.gateToggle !== "false") {
    appDiv.style.display = show ? "none" : "block";
  }
  var sidebar   = document.querySelector(".sidebar");
  var main      = document.querySelector(".main");
  var mobTopbar = document.querySelector(".mobile-topbar");
  var banner    = document.getElementById("auth-gate");
  if (show && banner) {
    var h = banner.offsetHeight || 44;
    if (sidebar)   sidebar.style.top   = h + "px";
    if (mobTopbar) mobTopbar.style.top = h + "px";
    if (main)      main.style.paddingTop = (h + 8) + "px";
  } else {
    if (sidebar)   sidebar.style.top   = "0";
    if (mobTopbar) mobTopbar.style.top = "0";
    if (main)      main.style.paddingTop = "";
  }
}
