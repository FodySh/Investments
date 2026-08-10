/**
 * shared/format.js
 * Number & percentage formatting utilities.
 *
 * Globals exposed: fmtNum(), fmtPct(), fmtCurrency()
 */

function fmtNum(n, decimals) {
  if (n == null || isNaN(n)) return '\u2014';
  var dec = decimals || 0;
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

function fmtPct(p) {
  if (p == null || isNaN(p)) return '\u2014';
  var cls = p >= 0 ? 'up' : 'dn';
  return '<span class="' + cls + '">' + (p >= 0 ? '+' : '') + (p * 100).toFixed(2) + '%</span>';
}

function fmtCurrency(n, decimals, symbol) {
  if (n == null || isNaN(n)) return '\u2014';
  var sym = symbol || '\u0631.\u0633';
  return fmtNum(n, decimals || 0) + ' ' + sym;
}
