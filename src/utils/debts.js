/**
 * Debt-calculation helpers extracted from debts.html.
 * Pure functions — no DOM access.
 */

/**
 * Compute aggregate debt KPIs.
 * (debts.html:2668-2678)
 * @param {Array} debtsData  [{direction, status, remaining?, amount}]
 * @returns {{owe:number, lend:number, net:number}}
 */
function calcDebtKPIs(debtsData) {
  var list = debtsData || [];

  var owe = list
    .filter(function (d) { return d.direction === 'owe' && d.status !== 'مسوَّى'; })
    .reduce(function (s, d) { return s + (d.remaining || d.amount || 0); }, 0);

  var lend = list
    .filter(function (d) { return d.direction === 'lend' || d.direction === 'owed'; })
    .filter(function (d) { return d.status !== 'مسوَّى'; })
    .reduce(function (s, d) { return s + (d.remaining || d.amount || 0); }, 0);

  return { owe: owe, lend: lend, net: lend - owe };
}

/**
 * Calculate remaining amount and pay-off percentage for a single debt.
 * (debts.html:2771-2778)
 * @param {number} amount  total debt
 * @param {number} paid    amount already paid
 * @returns {{remaining:number, pct:number}}
 */
function calcDebtRemaining(amount, paid) {
  var rem = Math.max(0, (amount || 0) - (paid || 0));
  var pctVal = amount > 0 ? Math.round((paid / amount) * 100) : 0;
  return { remaining: rem, pct: pctVal };
}

/**
 * Progress percentage from amount vs remaining.
 * (debts.html:2906)
 * @param {number} amount
 * @param {number} remaining
 * @returns {number} 0-100
 */
function calcDebtProgress(amount, remaining) {
  if (!amount || amount <= 0) return 0;
  return Math.min(100, ((amount - remaining) / amount) * 100);
}

/**
 * Due-date warning classification.
 * (debts.html:2913-2926)
 * @param {string} dueDate  ISO date string
 * @param {Date}   [now]    override for testing
 * @returns {{show:boolean, text:string, level:string}|null}
 */
function dueDateWarning(dueDate, now) {
  if (!dueDate) return null;
  if (!now) now = new Date();
  var daysLeft = Math.ceil((new Date(dueDate) - now) / 86400000);

  if (daysLeft < 0) {
    return {
      show: true,
      text: '⚠️ تجاوز تاريخ الاستحقاق بـ ' + Math.abs(daysLeft) + ' يوم',
      level: 'overdue'
    };
  }
  if (daysLeft <= 14) {
    return {
      show: true,
      text: '⏰ يستحق بعد ' + daysLeft + ' يوم',
      level: 'soon'
    };
  }
  return { show: false, text: '', level: 'ok' };
}

module.exports = { calcDebtKPIs, calcDebtRemaining, calcDebtProgress, dueDateWarning };
