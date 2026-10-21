/**
 * Core financial calculation helpers extracted from index.html.
 * All functions are pure — they accept values and return results.
 */

/**
 * Calculate net investment after fees and tax.
 * (index.html:4354  —  const net = amount - fees - tax)
 */
function calcNet(amount, fees, tax) {
  return (amount || 0) - (fees || 0) - (tax || 0);
}

/**
 * Unrealised gain/loss.
 * (index.html:4355  —  marketVal > 0 ? marketVal - net : null)
 */
function calcUnrealized(marketVal, net) {
  return marketVal > 0 ? marketVal - net : null;
}

/**
 * Return-on-investment ratio.
 * (index.html:4378  —  net > 0 && retVal !== 0 ? retVal / net : null)
 */
function calcROI(net, retVal) {
  return net > 0 && retVal !== 0 ? retVal / net : null;
}

/**
 * Total expected value.
 * (index.html:4374  —  net + retVal)
 */
function calcTotal(net, retVal) {
  return net + retVal;
}

/**
 * Derive retVal from retPct when retVal is 0.
 * (index.html:4369  —  net * (retPct / 100))
 */
function deriveRetVal(net, retPct, retVal) {
  if (retPct > 0 && retVal === 0 && net > 0) {
    return net * (retPct / 100);
  }
  return retVal;
}

/**
 * Annualised ROI.
 * (index.html:4421-4422  —  roi / (daysSince / 365))
 */
function annualizedROI(retVal, net, daysSince) {
  if (net <= 0 || daysSince <= 0 || retVal === 0) return null;
  var roi = retVal / net;
  return roi / (daysSince / 365);
}

/**
 * MOIC — Multiple on Invested Capital.
 * (index.html:4430  —  total / net)
 */
function calcMOIC(total, net) {
  return net > 0 && total > 0 ? total / net : null;
}

/**
 * Stock P&L calculations.
 * (index.html:4447-4469)
 */
function calcStockPnL(shares, buyPrice, currPrice) {
  if (shares <= 0 || currPrice <= 0) return null;
  var mktVal = shares * currPrice;
  var cost = shares * buyPrice;
  var pnl = mktVal - cost;
  var chg = cost > 0 ? pnl / cost : 0;
  return { mktVal: mktVal, cost: cost, pnl: pnl, chg: chg };
}

/**
 * Days-since and days-left helper.
 * (index.html:4392-4415)
 * @param {string} dateIn   ISO date string
 * @param {string} dateOut  ISO date string
 * @param {Date}   [today]  override for testing
 */
function calcDaysInfo(dateIn, dateOut, today) {
  if (!today) {
    today = new Date();
    today.setHours(0, 0, 0, 0);
  }
  var daysSince = null;
  var daysLeft = null;

  if (dateIn) {
    var dIn = new Date(dateIn);
    daysSince = Math.floor((today - dIn) / 86400000);
  }
  if (dateOut) {
    var dOut = new Date(dateOut);
    daysLeft = Math.floor((dOut - today) / 86400000);
  }
  return { daysSince: daysSince, daysLeft: daysLeft };
}

module.exports = {
  calcNet,
  calcUnrealized,
  calcROI,
  calcTotal,
  deriveRetVal,
  annualizedROI,
  calcMOIC,
  calcStockPnL,
  calcDaysInfo
};
