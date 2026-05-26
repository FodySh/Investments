/**

- محفظتي — نظام الجولة التعريفية
- Guided Tour System — works across all pages
- Usage: include <script src="tour.js"></script> in any page
  */

(function() {
‘use strict’;

// ── Tours config per page ─────────────────────────────────────────────────────
var TOURS = {

‘index.html’: [
{ sel: ‘.sidebar’,              title: ‘القائمة الجانبية’,         body: ‘من هنا تنتقل بين جميع أقسام التطبيق — الأسهم، الفرص، القروض، وأكثر.’ },
{ sel: ‘#page-home’,            title: ‘لوحة الرئيسية’,            body: ‘نظرة سريعة على أبرز مؤشرات محفظتك: إجمالي الاستثمار، العوائد، والرصيد المتاح.’ },
{ sel: ‘.kpi-grid, .kpi-row’,   title: ‘المؤشرات الرئيسية (KPIs)’, body: ‘أربعة أرقام تلخّص وضع محفظتك دفعةً واحدة — انقر على أي منها لتفاصيل أكثر.’ },
{ sel: ‘#page-sukuk’,           title: ‘الفرص الاستثمارية’,        body: ‘سجّل صكوكك وصناديقك ومرابحاتك. تتبّع العائد والتواريخ واستلام التوزيعات.’ },
{ sel: ‘#page-stocks’,          title: ‘الأسهم’,                   body: ‘أسهمك السعودية والأمريكية مع أسعار حية وحساب الأرباح والخسائر تلقائياً.’ },
{ sel: ‘#page-loans’,           title: ‘القروض البنكية’,            body: ‘أدخل تفاصيل قرضك مرة واحدة — يُولَّد جدول السداد الكامل تلقائياً.’ },
{ sel: ‘#page-admin’,           title: ‘لوحة الإدارة’,             body: ‘متاحة للأدمن فقط — تحكّم في الصفحات المرئية لكل مستخدم.’ },
{ sel: ‘.mobile-nav, .sidebar’, title: ‘التنقل السريع’,            body: ‘على الجوال: شريط سفلي بأربع أيقونات + ☰ للقائمة الكاملة. على الحاسب: القائمة الجانبية.’ },
],

‘expenses.html’: [
{ sel: ‘.exp-tabs’,             title: ‘تبويبات الصفحة’,           body: ‘ثلاثة أقسام: الإدخال لتسجيل المصاريف، التحليل للتقارير، والإعدادات لإدارة الحسابات والفئات.’ },
{ sel: ‘.salary-card’,          title: ‘الراتب الشهري’,            body: ‘أدخل راتبك الأساسي هنا. الشريط الملوّن يوضّح كيف يتوزع دخلك على المصاريف والمتبقي.’ },
{ sel: ‘#pane-fixed’,           title: ‘المصاريف الثابتة’,         body: ‘مصاريف لا تتغير شهرياً — إيجار، قسط، اشتراكات. يمكن تحديدها بمبلغ ثابت أو نسبة من الراتب.’ },
{ sel: ‘#pane-variable’,        title: ‘المصاريف المتغيرة’,        body: ‘سجّل مصاريفك اليومية هنا. استخدم ← → للتنقل بين الأشهر ومتابعة كل شهر بشكل منفصل.’ },
{ sel: ‘#pane-accrual’,         title: ‘المصاريف الدورية (Accrual)’, body: ‘مصاريف سنوية أو ربع سنوية كالنادي والتأمين. تُحجز تدريجياً كل شهر وتختفي تلقائياً بعد انتهاء المدة.’ },
{ sel: ‘#exppane-analysis’,     title: ‘تبويبة التحليل’,           body: ‘رسوم بيانية ومقارنات — شارت سنوي، مقارنة الشهر بالسابق، تحليل الفئات، والمصاريف حسب الحساب.’ },
{ sel: ‘#exppane-settings’,     title: ‘الإعدادات’,                body: ‘أضف حساباتك البنكية وفئاتك المخصصة وميزانية لكل فئة — تنعكس تلقائياً في كل القوائم.’ },
{ sel: ‘.month-nav’,            title: ‘التنقل بين الأشهر’,        body: ‘اضغط ‹ › للانتقال بين الأشهر. كل شهر له مصاريفه المتغيرة ودخله الإضافي المستقل.’ },
],

‘debts.html’: [
{ sel: ‘.mobile-nav, .sidebar, nav’, title: ‘التنقل في الصفحة’,   body: ‘صفحتان في ملف واحد: الديون الشخصية والجمعيات. انتقل بينهما من القائمة.’ },
{ sel: ‘#page-debts’,           title: ‘الديون’,                   body: ‘سجّل ديونك أو ما هو مستحق لك. مع زر WhatsApp لإرسال تذكير مباشر للشخص المعني.’ },
{ sel: ‘#page-jamaa’,           title: ‘الجمعيات’,                 body: ‘تتبّع جمعياتك — عدد الأعضاء، القسط الشهري، دورك، وتاريخ الاستلام.’ },
{ sel: ‘#page-add-debt’,        title: ‘إضافة دين’,               body: ‘حدد الاتجاه: عليّ (مديون) أو له عندي (دائن). أضف رقم الهاتف لإرسال تذكير WhatsApp بضغطة.’ },
],

‘dashboard.html’: [
{ sel: ‘.topbar, header’,       title: ‘لوحة التحكم الكاملة’,     body: ‘تحليلات شاملة للمحفظة بالكامل — الأرباح، التوزيع، والأداء السنوي.’ },
{ sel: ‘#yearly-chart’,         title: ‘الرسم البياني السنوي’,     body: ‘مقارنة المبلغ المستثمر والعوائد لكل سنة — شاهد نمو محفظتك عبر الزمن.’ },
{ sel: ‘.donut-chart, #donut’,  title: ‘توزيع الأصول’,            body: ‘كيف تتوزع استثماراتك: صكوك، أسهم، صناديق، ونقد — دائرة تفاعلية بالنسب.’ },
],

};

// ── Detect current page ───────────────────────────────────────────────────────
function getPageKey() {
var path = window.location.pathname;
var file = path.split(’/’).pop() || ‘index.html’;
if (!file.includes(’.’)) file = ‘index.html’;
return file;
}

// ── State ─────────────────────────────────────────────────────────────────────
var currentStep = 0;
var steps = [];
var overlayEl, boxEl, spotEl, btnPrev, btnNext, btnClose, stepCounter;
var isActive = false;

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
var pageKey = getPageKey();
steps = TOURS[pageKey] || [];
if (!steps.length) return; // no tour for this page

injectStyles();
createUI();
createTourBtn();
}

// ── CSS ───────────────────────────────────────────────────────────────────────
function injectStyles() {
if (document.getElementById(‘tour-styles’)) return;
var s = document.createElement(‘style’);
s.id = ‘tour-styles’;
s.textContent = `
/* Tour Overlay */
#tour-overlay {
position: fixed; inset: 0; z-index: 9000;
pointer-events: none;
opacity: 0; transition: opacity .3s;
}
#tour-overlay.active { opacity: 1; pointer-events: all; }

```
/* Spotlight: uses box-shadow to create dark backdrop with cut-out */
#tour-spot {
  position: fixed; z-index: 9001;
  border-radius: 10px;
  box-shadow: 0 0 0 4px rgba(201,169,110,0.6), 0 0 0 9999px rgba(0,0,0,0.72);
  transition: all .4s cubic-bezier(.16,1,.3,1);
  pointer-events: none;
}

/* Tour box */
#tour-box {
  position: fixed; z-index: 9002;
  background: #1a1810;
  border: 1px solid rgba(201,169,110,0.35);
  border-radius: 16px;
  padding: 22px 22px 18px;
  width: 300px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1);
  transition: all .4s cubic-bezier(.16,1,.3,1);
  font-family: 'Cairo', sans-serif;
  direction: rtl;
}
#tour-box::before {
  content: '';
  position: absolute;
  width: 12px; height: 12px;
  background: #1a1810;
  border: 1px solid rgba(201,169,110,0.35);
  transform: rotate(45deg);
  z-index: -1;
}
#tour-box.arrow-top::before    { top:-7px; right:24px; border-bottom:none; border-right:none; }
#tour-box.arrow-bottom::before { bottom:-7px; right:24px; border-top:none; border-left:none; }
#tour-box.arrow-left::before   { left:-7px; top:24px; border-right:none; border-bottom:none; }

#tour-title {
  font-size: 15px; font-weight: 800;
  color: #e2c48a; margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
#tour-title::before {
  content: '';
  width: 4px; height: 18px;
  background: linear-gradient(180deg, #c9a96e, #4ecdc4);
  border-radius: 4px; flex-shrink: 0;
  display: block;
}
#tour-body {
  font-size: 13px; color: #8e92a3;
  line-height: 1.75; margin-bottom: 16px;
}
#tour-footer {
  display: flex; align-items: center;
  justify-content: space-between; gap: 8px;
}
#tour-counter {
  font-size: 11px; color: #596070;
  font-weight: 600; white-space: nowrap;
}
.tour-btn {
  padding: 7px 16px; border-radius: 8px;
  font-size: 12px; font-weight: 700;
  cursor: pointer; border: none;
  font-family: 'Cairo', sans-serif;
  transition: all .15s;
}
#tour-btn-close {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #596070;
}
#tour-btn-close:hover { border-color: #e07070; color: #e07070; }
#tour-btn-prev {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #8e92a3;
}
#tour-btn-prev:hover { background: rgba(255,255,255,0.1); color: #f0f0ee; }
#tour-btn-next {
  background: #c9a96e; color: #0d0c09;
  flex: 1;
}
#tour-btn-next:hover { background: #e2c48a; }

/* Progress dots */
#tour-dots {
  display: flex; gap: 5px; align-items: center;
}
.tour-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all .2s;
  cursor: pointer;
}
.tour-dot.active {
  background: #c9a96e; width: 18px; border-radius: 3px;
}

/* Launch button */
#tour-launch-btn {
  position: fixed;
  bottom: 84px; left: 16px;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(201,169,110,0.12);
  border: 1px solid rgba(201,169,110,0.3);
  color: #c9a96e;
  font-size: 18px; font-weight: 700;
  cursor: pointer;
  z-index: 8000;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  font-family: serif;
}
#tour-launch-btn:hover {
  background: rgba(201,169,110,0.22);
  border-color: #c9a96e;
  transform: scale(1.08);
}
#tour-launch-btn .tour-launch-tooltip {
  position: absolute;
  left: calc(100% + 10px);
  white-space: nowrap;
  background: #1a1810;
  border: 1px solid rgba(201,169,110,0.25);
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px; font-weight: 600;
  color: #c9a96e;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
  font-family: 'Cairo', sans-serif;
}
#tour-launch-btn:hover .tour-launch-tooltip { opacity: 1; }

@media (max-width: 600px) {
  #tour-box { width: calc(100vw - 32px); left: 16px !important; right: 16px !important; }
  #tour-launch-btn { bottom: 76px; }
}
```

`;
document.head.appendChild(s);
}

// ── Create UI elements ────────────────────────────────────────────────────────
function createUI() {
overlayEl = el(‘div’, { id: ‘tour-overlay’ });
overlayEl.addEventListener(‘click’, function(e) {
if (e.target === overlayEl) endTour();
});

spotEl = el(‘div’, { id: ‘tour-spot’ });

boxEl = el(‘div’, { id: ‘tour-box’ });
boxEl.innerHTML = `<div id="tour-title"></div> <div id="tour-body"></div> <div id="tour-footer"> <button id="tour-btn-close" class="tour-btn">✕ إنهاء</button> <div id="tour-dots"></div> <div style="display:flex;gap:6px"> <button id="tour-btn-prev" class="tour-btn">‹ السابق</button> <button id="tour-btn-next" class="tour-btn">التالي ›</button> </div> </div>`;

document.body.appendChild(overlayEl);
document.body.appendChild(spotEl);
document.body.appendChild(boxEl);

document.getElementById(‘tour-btn-close’).addEventListener(‘click’, endTour);
document.getElementById(‘tour-btn-prev’).addEventListener(‘click’, function() { goTo(currentStep - 1); });
document.getElementById(‘tour-btn-next’).addEventListener(‘click’, function() {
if (currentStep < steps.length - 1) goTo(currentStep + 1);
else endTour();
});

stepCounter  = document.getElementById(‘tour-counter’);
btnPrev = document.getElementById(‘tour-btn-prev’);
btnNext = document.getElementById(‘tour-btn-next’);
}

function createTourBtn() {
var btn = el(‘button’, { id: ‘tour-launch-btn’ });
btn.innerHTML = ‘❓<span class="tour-launch-tooltip">جولة تعريفية</span>’;
btn.addEventListener(‘click’, startTour);
document.body.appendChild(btn);
}

// ── Tour logic ────────────────────────────────────────────────────────────────
function startTour() {
if (!steps.length) return;
isActive = true;
currentStep = 0;
overlayEl.classList.add(‘active’);
spotEl.style.display = ‘block’;
boxEl.style.display = ‘block’;
goTo(0);
}

function endTour() {
isActive = false;
overlayEl.classList.remove(‘active’);
spotEl.style.display = ‘none’;
boxEl.style.display = ‘none’;
}

function goTo(idx) {
if (idx < 0 || idx >= steps.length) return;
currentStep = idx;
var step = steps[idx];

// Find target element
var target = step.sel ? document.querySelector(step.sel) : null;

// Update text
document.getElementById(‘tour-title’).textContent = step.title;
document.getElementById(‘tour-body’).textContent  = step.body;

// Update dots
var dotsEl = document.getElementById(‘tour-dots’);
dotsEl.innerHTML = steps.map(function(_, i) {
var d = el(‘div’, { className: ‘tour-dot’ + (i === idx ? ’ active’ : ‘’) });
d.addEventListener(‘click’, function() { goTo(i); });
return d.outerHTML;
}).join(’’);

// Buttons
btnPrev.style.display = idx === 0 ? ‘none’ : ‘’;
btnNext.textContent = idx === steps.length - 1 ? ‘✓ إنهاء’ : ‘التالي ›’;

// Position spotlight + box
if (target) {
positionOnElement(target);
} else {
// Center on screen
spotEl.style.cssText = ‘position:fixed;top:50%;left:50%;width:1px;height:1px;transform:translate(-50%,-50%);box-shadow:0 0 0 9999px rgba(0,0,0,0.72);border-radius:0;’;
positionBoxCenter();
}
}

function positionOnElement(target) {
var r = target.getBoundingClientRect();
var pad = 8;

// Highlight
spotEl.style.cssText = `position: fixed; top: ${r.top - pad}px; left: ${r.left - pad}px; width: ${r.width + pad*2}px; height: ${r.height + pad*2}px; border-radius: 10px; box-shadow: 0 0 0 4px rgba(201,169,110,0.6), 0 0 0 9999px rgba(0,0,0,0.72); pointer-events: none; transition: all .4s cubic-bezier(.16,1,.3,1);`;

// Position box — prefer below, fallback above, then right
var bw = 300, bh = 180, gap = 16;
var vw = window.innerWidth, vh = window.innerHeight;

var boxLeft = r.left;
var boxTop;
var arrowClass = ‘arrow-top’;

// Below target?
if (r.bottom + gap + bh < vh) {
boxTop = r.bottom + gap;
arrowClass = ‘arrow-top’;
}
// Above target?
else if (r.top - gap - bh > 0) {
boxTop = r.top - gap - bh;
arrowClass = ‘arrow-bottom’;
}
// Right of target?
else {
boxLeft = r.right + gap;
boxTop  = Math.max(8, Math.min(r.top, vh - bh - 8));
arrowClass = ‘arrow-left’;
}

// Clamp horizontal
boxLeft = Math.max(8, Math.min(boxLeft, vw - bw - 8));

boxEl.className = arrowClass;
boxEl.style.cssText = `position: fixed; top: ${boxTop}px; left: ${boxLeft}px; width: ${bw}px; z-index: 9002;`;
}

function positionBoxCenter() {
var bw = 300, bh = 180;
boxEl.className = ‘’;
boxEl.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${bw}px; z-index: 9002;`;
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener(‘keydown’, function(e) {
if (!isActive) return;
if (e.key === ‘Escape’)       endTour();
if (e.key === ‘ArrowRight’ || e.key === ‘ArrowDown’) goTo(currentStep + 1);
if (e.key === ‘ArrowLeft’  || e.key === ‘ArrowUp’)   goTo(currentStep - 1);
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function el(tag, attrs) {
var e = document.createElement(tag);
Object.assign(e, attrs);
return e;
}

// ── Boot ──────────────────────────────────────────────────────────────────────
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, init);
} else {
setTimeout(init, 600); // wait for page to settle
}

})();