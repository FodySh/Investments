const {
  calcDebtKPIs, calcDebtRemaining, calcDebtProgress, dueDateWarning
} = require('../src/utils/debts');

describe('calcDebtKPIs', () => {
  test('sums owed debts (direction=owe, not settled)', () => {
    var data = [
      { direction: 'owe', status: 'قائم', remaining: 5000 },
      { direction: 'owe', status: 'قائم', amount: 3000 }   // no remaining → uses amount
    ];
    var r = calcDebtKPIs(data);
    expect(r.owe).toBe(8000);
    expect(r.lend).toBe(0);
    expect(r.net).toBe(-8000);
  });

  test('sums lent debts (direction=lend or owed)', () => {
    var data = [
      { direction: 'lend', status: 'قائم', remaining: 2000 },
      { direction: 'owed', status: 'قائم', remaining: 1000 }
    ];
    var r = calcDebtKPIs(data);
    expect(r.lend).toBe(3000);
    expect(r.owe).toBe(0);
    expect(r.net).toBe(3000);
  });

  test('excludes settled debts (مسوَّى)', () => {
    var data = [
      { direction: 'owe', status: 'مسوَّى', remaining: 5000 },
      { direction: 'lend', status: 'مسوَّى', remaining: 3000 }
    ];
    var r = calcDebtKPIs(data);
    expect(r.owe).toBe(0);
    expect(r.lend).toBe(0);
    expect(r.net).toBe(0);
  });

  test('mixed debts compute correct net', () => {
    var data = [
      { direction: 'owe', status: 'قائم', remaining: 4000 },
      { direction: 'lend', status: 'قائم', remaining: 6000 }
    ];
    var r = calcDebtKPIs(data);
    expect(r.owe).toBe(4000);
    expect(r.lend).toBe(6000);
    expect(r.net).toBe(2000);
  });

  test('handles empty array', () => {
    var r = calcDebtKPIs([]);
    expect(r.owe).toBe(0);
    expect(r.lend).toBe(0);
    expect(r.net).toBe(0);
  });

  test('handles null/undefined', () => {
    expect(calcDebtKPIs(null).net).toBe(0);
    expect(calcDebtKPIs(undefined).net).toBe(0);
  });
});

describe('calcDebtRemaining', () => {
  test('calculates remaining and percentage', () => {
    var r = calcDebtRemaining(10000, 3000);
    expect(r.remaining).toBe(7000);
    expect(r.pct).toBe(30);
  });

  test('remaining does not go below 0', () => {
    var r = calcDebtRemaining(5000, 6000);
    expect(r.remaining).toBe(0);
    expect(r.pct).toBe(120); // over-paid
  });

  test('zero amount yields 0 pct', () => {
    var r = calcDebtRemaining(0, 0);
    expect(r.remaining).toBe(0);
    expect(r.pct).toBe(0);
  });

  test('no paid amount', () => {
    var r = calcDebtRemaining(10000, 0);
    expect(r.remaining).toBe(10000);
    expect(r.pct).toBe(0);
  });

  test('fully paid', () => {
    var r = calcDebtRemaining(10000, 10000);
    expect(r.remaining).toBe(0);
    expect(r.pct).toBe(100);
  });
});

describe('calcDebtProgress', () => {
  test('50% progress', () => {
    expect(calcDebtProgress(10000, 5000)).toBeCloseTo(50);
  });

  test('full payment = 100%', () => {
    expect(calcDebtProgress(10000, 0)).toBeCloseTo(100);
  });

  test('no payment = 0%', () => {
    expect(calcDebtProgress(10000, 10000)).toBeCloseTo(0);
  });

  test('caps at 100% even if over-paid', () => {
    expect(calcDebtProgress(5000, -1000)).toBe(100);
  });

  test('returns 0 when amount is 0', () => {
    expect(calcDebtProgress(0, 0)).toBe(0);
  });
});

describe('dueDateWarning', () => {
  var now = new Date('2025-06-15T12:00:00');

  test('overdue by 5 days', () => {
    var r = dueDateWarning('2025-06-10', now);
    expect(r.show).toBe(true);
    expect(r.level).toBe('overdue');
    expect(r.text).toContain('5');
  });

  test('due in 7 days (soon)', () => {
    var r = dueDateWarning('2025-06-22', now);
    expect(r.show).toBe(true);
    expect(r.level).toBe('soon');
    expect(r.text).toContain('7');
  });

  test('due in 14 days (boundary — still soon)', () => {
    var r = dueDateWarning('2025-06-29', now);
    expect(r.show).toBe(true);
    expect(r.level).toBe('soon');
  });

  test('due in 30 days (ok)', () => {
    var r = dueDateWarning('2025-07-15', now);
    expect(r.show).toBe(false);
    expect(r.level).toBe('ok');
  });

  test('returns null for empty date', () => {
    expect(dueDateWarning('', now)).toBeNull();
    expect(dueDateWarning(null, now)).toBeNull();
    expect(dueDateWarning(undefined, now)).toBeNull();
  });

  test('due today', () => {
    var r = dueDateWarning('2025-06-15', now);
    expect(r.show).toBe(true);
    expect(r.level).toBe('soon');
  });
});
