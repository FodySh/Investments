/**
 * Formatting utilities extracted from index.html, dashboard.html, expenses.html.
 * Pure functions with no DOM dependencies.
 */

/** Format a number with locale separators (index.html:4050) */
function fmtNum(n, dec) {
  if (dec === undefined) dec = 0;
  if (n == null || n === undefined || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

/** Format a ratio as a coloured percentage HTML string (index.html:4054) */
function fmtPct(p) {
  if (p == null || isNaN(p)) return '—';
  var cls = p >= 0 ? 'up' : 'dn';
  return '<span class="' + cls + '">' + (p >= 0 ? '+' : '') + (p * 100).toFixed(2) + '%</span>';
}

/** Short integer formatter — treats falsy as 0 (dashboard.html:2323) */
function fmt(n) {
  return (n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Two-decimal formatter — treats falsy as 0 (dashboard.html:2324) */
function fmt2(n) {
  return (n || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/** Ratio → percentage string (dashboard.html:2325) */
function pct(n) {
  return ((n || 0) * 100).toFixed(2) + '%';
}

/** Parse a date string; returns null on invalid input (dashboard.html:1998) */
function parseDate(str) {
  if (!str) return null;
  var d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/** "يناير 2024" style month label (expenses.html:568) */
var MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

function monthStr(ym) {
  var p = ym.split('-');
  return MONTHS[+p[1] - 1] + ' ' + p[0];
}

module.exports = { fmtNum, fmtPct, fmt, fmt2, pct, parseDate, monthStr, MONTHS };
