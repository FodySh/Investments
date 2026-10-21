/**
 * Expense-calculation helpers extracted from expenses.html.
 * Pure functions — no DOM access.
 */

/**
 * Resolve a fixed-expense entry to its monthly SAR amount.
 * (expenses.html:589)
 * @param {{mode:string, pct?:number, amount?:number}} x  fixed-expense object
 * @param {number} salary  monthly salary
 */
function resolveFixed(x, salary) {
  return x.mode === 'pct'
    ? Math.round((salary || 0) * (x.pct || 0) / 100)
    : (x.amount || 0);
}

/**
 * Monthly portion of an accrual item.
 * (expenses.html:588)
 * @param {{total:number, months?:number}} a
 */
function monthlyAcc(a) {
  return Math.ceil((a.total || 0) / (a.months || 12));
}

/**
 * Total income for a month.
 * (expenses.html:569-572)
 * @param {number} salary  base salary
 * @param {Array}  monthlyInc  extra incomes for the month [{amount}]
 */
function totalIncome(salary, monthlyInc) {
  var extra = (monthlyInc || []).reduce(function (s, x) { return s + (x.amount || 0); }, 0);
  return (salary || 0) + extra;
}

/**
 * Sum of all fixed expenses.
 * (expenses.html:574)
 * @param {Array}  fixedItems  array of fixed-expense objects
 * @param {number} salary
 */
function totalFixed(fixedItems, salary) {
  return (fixedItems || []).reduce(function (s, x) { return s + resolveFixed(x, salary); }, 0);
}

/**
 * Sum of all variable expenses for a given month.
 * (expenses.html:575)
 * @param {Array} items  array of {amount} for the month
 */
function totalVariable(items) {
  return (items || []).reduce(function (s, x) { return s + (x.amount || 0); }, 0);
}

/**
 * Sum of accrual items whose date range includes the given month.
 * (expenses.html:576-586)
 * @param {Array}  accrualItems  [{startDate, total, months}]
 * @param {string} currentMonth  "YYYY-MM"
 */
function totalAccrual(accrualItems, currentMonth) {
  var cp = currentMonth.split('-');
  var viewMonthStart = new Date(+cp[0], +cp[1] - 1, 1);

  return (accrualItems || []).reduce(function (s, a) {
    if (!a.startDate) return s;
    var start = new Date(a.startDate);
    var startMS = new Date(start.getFullYear(), start.getMonth(), 1);
    var endMS = new Date(start.getFullYear(), start.getMonth() + (a.months || 12), 1);
    if (viewMonthStart >= startMS && viewMonthStart < endMS) return s + monthlyAcc(a);
    return s;
  }, 0);
}

module.exports = { resolveFixed, monthlyAcc, totalIncome, totalFixed, totalVariable, totalAccrual };
