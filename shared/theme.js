/**
 * shared/theme.js
 * Dark/light theme toggle with localStorage persistence.
 *
 * Globals exposed: isLightMode, applyTheme(), toggleTheme()
 */

var isLightMode = localStorage.getItem('theme') === 'light';

function applyTheme(light) {
  isLightMode = light;
  document.body.classList.toggle('light-mode', light);
  var toggle = document.getElementById('theme-toggle');
  var knob   = document.getElementById('theme-knob');
  var label  = document.getElementById('theme-label');
  if (toggle) toggle.classList.toggle('light', light);
  if (knob)   knob.textContent  = light ? '\u2600\uFE0F' : '\uD83C\uDF19';
  if (label)  label.textContent = light ? '\u2600\uFE0F \u0646\u0647\u0627\u0631\u064A' : '\uD83C\uDF19 \u0644\u064A\u0644\u064A';
  localStorage.setItem('theme', light ? 'light' : 'dark');
}

function toggleTheme() { applyTheme(!isLightMode); }

// Apply saved theme immediately
applyTheme(isLightMode);
