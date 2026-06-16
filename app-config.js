/**
 * Shared application configuration
 * Centralizes Firebase config, Worker URLs, and security utilities.
 */

// ─── Firebase Configuration ───────────────────────────────────────────────────
var APP_CONFIG = {
  firebase: {
    apiKey:            "AIzaSyAE9VvmxCorzJ8d1MUAZds6TyQC1gw67ME",
    authDomain:        "investments-page.firebaseapp.com",
    projectId:         "investments-page",
    storageBucket:     "investments-page.firebasestorage.app",
    messagingSenderId: "964948881361",
    appId:             "1:964948881361:web:2801b8127489d953717af0"
  },

  // ─── Cloudflare Worker Proxy URLs ─────────────────────────────────────────
  proxy: {
    stockPrice:  "https://stockprice.shaheenhouse1.workers.dev",
    claudeProxy: "https://claude-proxy.shaheenhouse1.workers.dev"
  }
};

// ─── Security: HTML Escaping Utility ──────────────────────────────────────────
// Use this instead of raw string interpolation in innerHTML assignments
function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Security: Safe attribute value escaping ─────────────────────────────────
function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
