/**
 * Pill/badge HTML generators extracted from index.html and dashboard.html.
 * Pure functions returning HTML strings.
 */

/** Risk-level pill (index.html:4059) */
function riskPill(r) {
  var m = { 'منخفض': 'low', 'متوسط': 'mid', 'عالي': 'high' };
  return '<span class="pill pill-' + (m[r] || 'low') + '">' + (r || '—') + '</span>';
}

/** Status pill (index.html:4063) */
function statusPill(s) {
  var clean = (s || '').trim();
  if (clean === 'نشطة') return '<span class="pill pill-active">نشطة</span>';
  if (clean === 'مستلمة') return '<span class="pill pill-done">مستلمة</span>';
  return '<span class="pill">' + clean + '</span>';
}

/** Investment-type pill (index.html:4069) */
function typePill(t) {
  var m = { 'صك': 'sukuk', 'صندوق': 'fund', 'سهم': 'stock', 'سند': 'bond' };
  return '<span class="pill pill-' + (m[t] || 'sukuk') + '">' + t + '</span>';
}

/** Sync-state badge (dashboard.html:2128 / 1739) */
function badge(state) {
  if (state === 'synced')  return '<span class="badge badge-ok">✓ محدّث</span>';
  if (state === 'saving')  return '<span class="badge badge-saving">⏳ جاري الحفظ</span>';
  if (state === 'error')   return '<span class="badge badge-err">✗ خطأ</span>';
  if (state === 'offline') return '<span class="badge badge-off">⊘ غير متصل</span>';
  return '';
}

module.exports = { riskPill, statusPill, typePill, badge };
