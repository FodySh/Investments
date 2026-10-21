const {
  resolveFixed, monthlyAcc, totalIncome, totalFixed, totalVariable, totalAccrual
} = require('../src/utils/expenses');

describe('resolveFixed', () => {
  test('percentage mode calculates from salary', () => {
    expect(resolveFixed({ mode: 'pct', pct: 10 }, 15000)).toBe(1500);
    expect(resolveFixed({ mode: 'pct', pct: 33 }, 10000)).toBe(3300);
  });

  test('percentage mode rounds to integer', () => {
    expect(resolveFixed({ mode: 'pct', pct: 7 }, 3000)).toBe(210);
    // 3000 * 7.5 / 100 = 225
    expect(resolveFixed({ mode: 'pct', pct: 7.5 }, 3000)).toBe(225);
  });

  test('amount mode returns fixed amount', () => {
    expect(resolveFixed({ mode: 'amount', amount: 500 }, 15000)).toBe(500);
  });

  test('defaults to amount when mode is unrecognised', () => {
    expect(resolveFixed({ mode: 'other', amount: 300 }, 10000)).toBe(300);
  });

  test('handles missing pct/amount', () => {
    expect(resolveFixed({ mode: 'pct' }, 15000)).toBe(0);
    expect(resolveFixed({ mode: 'amount' }, 15000)).toBe(0);
  });

  test('handles zero salary in pct mode', () => {
    expect(resolveFixed({ mode: 'pct', pct: 10 }, 0)).toBe(0);
  });
});

describe('monthlyAcc', () => {
  test('divides total by months and ceils', () => {
    expect(monthlyAcc({ total: 1200, months: 12 })).toBe(100);
    expect(monthlyAcc({ total: 1000, months: 3 })).toBe(334); // ceil(333.33)
  });

  test('defaults to 12 months when missing', () => {
    expect(monthlyAcc({ total: 1200 })).toBe(100);
  });

  test('handles zero total', () => {
    expect(monthlyAcc({ total: 0, months: 6 })).toBe(0);
  });

  test('handles missing total', () => {
    expect(monthlyAcc({})).toBe(0);
  });
});

describe('totalIncome', () => {
  test('salary only', () => {
    expect(totalIncome(15000, [])).toBe(15000);
  });

  test('salary plus extras', () => {
    var extras = [{ amount: 500 }, { amount: 300 }];
    expect(totalIncome(15000, extras)).toBe(15800);
  });

  test('handles null extras', () => {
    expect(totalIncome(15000, null)).toBe(15000);
  });

  test('handles zero salary', () => {
    expect(totalIncome(0, [{ amount: 1000 }])).toBe(1000);
  });
});

describe('totalFixed', () => {
  test('sums resolved fixed items', () => {
    var items = [
      { mode: 'amount', amount: 1000 },
      { mode: 'amount', amount: 500 },
      { mode: 'pct', pct: 10 }
    ];
    // 1000 + 500 + round(15000*10/100)=1500 → 3000
    expect(totalFixed(items, 15000)).toBe(3000);
  });

  test('empty list returns 0', () => {
    expect(totalFixed([], 15000)).toBe(0);
  });

  test('handles null list', () => {
    expect(totalFixed(null, 15000)).toBe(0);
  });
});

describe('totalVariable', () => {
  test('sums variable expense amounts', () => {
    var items = [{ amount: 200 }, { amount: 350 }, { amount: 100 }];
    expect(totalVariable(items)).toBe(650);
  });

  test('empty list returns 0', () => {
    expect(totalVariable([])).toBe(0);
  });

  test('handles null', () => {
    expect(totalVariable(null)).toBe(0);
  });

  test('handles missing amount fields', () => {
    expect(totalVariable([{}, { amount: 100 }])).toBe(100);
  });
});

describe('totalAccrual', () => {
  test('includes accrual whose range covers the month', () => {
    var items = [
      { startDate: '2024-01-01', total: 12000, months: 12 } // Jan 2024 – Dec 2024
    ];
    expect(totalAccrual(items, '2024-06')).toBe(1000);
  });

  test('excludes accrual outside range', () => {
    var items = [
      { startDate: '2024-01-01', total: 12000, months: 6 } // Jan – Jun 2024
    ];
    // July 2024 is outside
    expect(totalAccrual(items, '2024-07')).toBe(0);
  });

  test('includes start month', () => {
    var items = [
      { startDate: '2024-03-15', total: 6000, months: 6 }
    ];
    expect(totalAccrual(items, '2024-03')).toBe(1000);
  });

  test('excludes end month (exclusive)', () => {
    var items = [
      { startDate: '2024-01-01', total: 3000, months: 3 } // Jan, Feb, Mar → ends at Apr
    ];
    expect(totalAccrual(items, '2024-04')).toBe(0);
    expect(totalAccrual(items, '2024-03')).toBe(1000);
  });

  test('sums multiple accruals', () => {
    var items = [
      { startDate: '2024-01-01', total: 12000, months: 12 },
      { startDate: '2024-06-01', total: 6000, months: 6 }
    ];
    // June: 1000 + 1000 = 2000
    expect(totalAccrual(items, '2024-06')).toBe(2000);
  });

  test('skips items without startDate', () => {
    var items = [
      { total: 12000, months: 12 },
      { startDate: '2024-01-01', total: 3000, months: 12 }
    ];
    expect(totalAccrual(items, '2024-06')).toBe(250);
  });

  test('empty list returns 0', () => {
    expect(totalAccrual([], '2024-06')).toBe(0);
  });
});
