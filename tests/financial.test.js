const {
  calcNet, calcUnrealized, calcROI, calcTotal,
  deriveRetVal, annualizedROI, calcMOIC, calcStockPnL, calcDaysInfo
} = require('../src/utils/financial');

describe('calcNet', () => {
  test('subtracts fees and tax from amount', () => {
    expect(calcNet(10000, 100, 50)).toBe(9850);
  });

  test('treats missing values as 0', () => {
    expect(calcNet(5000)).toBe(5000);
    expect(calcNet(5000, 0, 0)).toBe(5000);
  });

  test('handles all zeros', () => {
    expect(calcNet(0, 0, 0)).toBe(0);
  });
});

describe('calcUnrealized', () => {
  test('returns gain when market value exceeds net', () => {
    expect(calcUnrealized(11000, 10000)).toBe(1000);
  });

  test('returns loss when market value below net', () => {
    expect(calcUnrealized(9000, 10000)).toBe(-1000);
  });

  test('returns null when marketVal is 0 or negative', () => {
    expect(calcUnrealized(0, 10000)).toBeNull();
    expect(calcUnrealized(-100, 10000)).toBeNull();
  });
});

describe('calcROI', () => {
  test('computes ratio of return to net', () => {
    expect(calcROI(10000, 1500)).toBeCloseTo(0.15);
  });

  test('returns null when net is 0 or negative', () => {
    expect(calcROI(0, 1000)).toBeNull();
    expect(calcROI(-500, 1000)).toBeNull();
  });

  test('returns null when retVal is 0', () => {
    expect(calcROI(10000, 0)).toBeNull();
  });

  test('handles negative returns', () => {
    expect(calcROI(10000, -500)).toBeCloseTo(-0.05);
  });
});

describe('calcTotal', () => {
  test('sums net and return value', () => {
    expect(calcTotal(10000, 1500)).toBe(11500);
  });

  test('handles zero return', () => {
    expect(calcTotal(10000, 0)).toBe(10000);
  });

  test('handles negative return', () => {
    expect(calcTotal(10000, -500)).toBe(9500);
  });
});

describe('deriveRetVal', () => {
  test('calculates return value from percentage when retVal is 0', () => {
    expect(deriveRetVal(10000, 5, 0)).toBe(500);
  });

  test('returns original retVal when it is non-zero', () => {
    expect(deriveRetVal(10000, 5, 300)).toBe(300);
  });

  test('returns 0 when retPct is 0', () => {
    expect(deriveRetVal(10000, 0, 0)).toBe(0);
  });

  test('returns 0 when net is 0', () => {
    expect(deriveRetVal(0, 5, 0)).toBe(0);
  });
});

describe('annualizedROI', () => {
  test('annualizes return over given days', () => {
    // 10% return over 365 days → ~10% annualized
    var result = annualizedROI(1000, 10000, 365);
    expect(result).toBeCloseTo(0.10);
  });

  test('half-year holding doubles the annualized rate', () => {
    // 5% return over 182.5 days → ~10% annualized
    var result = annualizedROI(500, 10000, 182.5);
    expect(result).toBeCloseTo(0.10, 1);
  });

  test('returns null for zero or negative inputs', () => {
    expect(annualizedROI(0, 10000, 365)).toBeNull();
    expect(annualizedROI(1000, 0, 365)).toBeNull();
    expect(annualizedROI(1000, 10000, 0)).toBeNull();
  });
});

describe('calcMOIC', () => {
  test('returns total / net ratio', () => {
    expect(calcMOIC(15000, 10000)).toBeCloseTo(1.5);
    expect(calcMOIC(10000, 10000)).toBeCloseTo(1.0);
  });

  test('returns null when net or total is 0', () => {
    expect(calcMOIC(0, 10000)).toBeNull();
    expect(calcMOIC(15000, 0)).toBeNull();
  });
});

describe('calcStockPnL', () => {
  test('computes market value, cost, pnl, and change', () => {
    var r = calcStockPnL(100, 50, 60);
    expect(r.mktVal).toBe(6000);
    expect(r.cost).toBe(5000);
    expect(r.pnl).toBe(1000);
    expect(r.chg).toBeCloseTo(0.2);
  });

  test('handles loss scenario', () => {
    var r = calcStockPnL(100, 50, 40);
    expect(r.pnl).toBe(-1000);
    expect(r.chg).toBeCloseTo(-0.2);
  });

  test('returns null when shares or currPrice is 0', () => {
    expect(calcStockPnL(0, 50, 60)).toBeNull();
    expect(calcStockPnL(100, 50, 0)).toBeNull();
  });

  test('handles zero buy price (chg is 0)', () => {
    var r = calcStockPnL(100, 0, 60);
    expect(r.mktVal).toBe(6000);
    expect(r.chg).toBe(0);
  });
});

describe('calcDaysInfo', () => {
  var today = new Date('2025-06-15T00:00:00');

  test('calculates days since entry', () => {
    var r = calcDaysInfo('2025-06-01', null, today);
    expect(r.daysSince).toBe(14);
    expect(r.daysLeft).toBeNull();
  });

  test('calculates days left until exit', () => {
    var r = calcDaysInfo(null, '2025-07-15', today);
    expect(r.daysSince).toBeNull();
    expect(r.daysLeft).toBe(30);
  });

  test('calculates both when both dates given', () => {
    var r = calcDaysInfo('2025-06-01', '2025-07-15', today);
    expect(r.daysSince).toBe(14);
    expect(r.daysLeft).toBe(30);
  });

  test('negative daysLeft when exit date has passed', () => {
    var r = calcDaysInfo(null, '2025-06-10', today);
    expect(r.daysLeft).toBe(-5);
  });

  test('returns nulls when no dates', () => {
    var r = calcDaysInfo(null, null, today);
    expect(r.daysSince).toBeNull();
    expect(r.daysLeft).toBeNull();
  });
});
