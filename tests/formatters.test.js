const { fmtNum, fmtPct, fmt, fmt2, pct, parseDate, monthStr, MONTHS } = require('../src/utils/formatters');

describe('fmtNum', () => {
  test('formats integers with locale separators', () => {
    expect(fmtNum(1000)).toBe('1,000');
    expect(fmtNum(1234567)).toBe('1,234,567');
  });

  test('respects decimal places', () => {
    expect(fmtNum(1234.567, 2)).toBe('1,234.57');
    expect(fmtNum(100, 2)).toBe('100.00');
  });

  test('returns dash for null/undefined/NaN', () => {
    expect(fmtNum(null)).toBe('—');
    expect(fmtNum(undefined)).toBe('—');
    expect(fmtNum(NaN)).toBe('—');
  });

  test('handles zero', () => {
    expect(fmtNum(0)).toBe('0');
    expect(fmtNum(0, 2)).toBe('0.00');
  });

  test('handles negative numbers', () => {
    expect(fmtNum(-500)).toBe('-500');
    expect(fmtNum(-1234.5, 2)).toBe('-1,234.50');
  });
});

describe('fmtPct', () => {
  test('positive percentage has + prefix and "up" class', () => {
    expect(fmtPct(0.15)).toBe('<span class="up">+15.00%</span>');
  });

  test('negative percentage has "dn" class', () => {
    expect(fmtPct(-0.05)).toBe('<span class="dn">-5.00%</span>');
  });

  test('zero is treated as positive', () => {
    expect(fmtPct(0)).toBe('<span class="up">+0.00%</span>');
  });

  test('returns dash for null/NaN', () => {
    expect(fmtPct(null)).toBe('—');
    expect(fmtPct(NaN)).toBe('—');
  });
});

describe('fmt', () => {
  test('formats number with no decimals', () => {
    expect(fmt(1500)).toBe('1,500');
  });

  test('treats falsy as 0', () => {
    expect(fmt(0)).toBe('0');
    expect(fmt(null)).toBe('0');
    expect(fmt(undefined)).toBe('0');
  });
});

describe('fmt2', () => {
  test('formats with exactly 2 decimals', () => {
    expect(fmt2(1500)).toBe('1,500.00');
    expect(fmt2(99.9)).toBe('99.90');
  });

  test('treats falsy as 0.00', () => {
    expect(fmt2(0)).toBe('0.00');
    expect(fmt2(null)).toBe('0.00');
  });
});

describe('pct', () => {
  test('converts ratio to percentage string', () => {
    expect(pct(0.15)).toBe('15.00%');
    expect(pct(1)).toBe('100.00%');
  });

  test('treats falsy as 0%', () => {
    expect(pct(0)).toBe('0.00%');
    expect(pct(null)).toBe('0.00%');
  });
});

describe('parseDate', () => {
  test('parses valid ISO date', () => {
    const d = parseDate('2024-06-15');
    expect(d).toBeInstanceOf(Date);
    expect(d.getFullYear()).toBe(2024);
  });

  test('returns null for empty/falsy', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });

  test('returns null for invalid string', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });
});

describe('monthStr', () => {
  test('returns Arabic month name with year', () => {
    expect(monthStr('2024-01')).toBe('يناير 2024');
    expect(monthStr('2024-12')).toBe('ديسمبر 2024');
  });

  test('handles single-digit months', () => {
    expect(monthStr('2025-3')).toBe('مارس 2025');
  });
});

describe('MONTHS', () => {
  test('has 12 entries', () => {
    expect(MONTHS).toHaveLength(12);
  });

  test('first is January in Arabic', () => {
    expect(MONTHS[0]).toBe('يناير');
  });
});
