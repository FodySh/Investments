/**
 * shared/toast.js
 * Toast notification utility.
 *
 * Globals exposed: showToast(), toast() (alias)
 */

var _toastTimer = null;

function showToast(msg, duration) {
  var t = document.getElementById('toast') || document.getElementById('toast-el');
  if (!t) return;
  var ms = duration || (msg.indexOf('\u274C') !== -1 || msg.indexOf('\u0641\u0634\u0644') !== -1 || msg.indexOf('Load failed') !== -1 ? 10000 : 3500);
  t.textContent = msg;
  t.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ t.classList.remove('show'); }, ms);
  t.onclick = function(){ t.classList.remove('show'); clearTimeout(_toastTimer); };
}

function toast(msg, err) {
  showToast(msg, err ? 10000 : undefined);
}
