const { riskPill, statusPill, typePill, badge } = require('../src/utils/pills');

describe('riskPill', () => {
  test('maps Arabic risk levels to CSS classes', () => {
    expect(riskPill('منخفض')).toBe('<span class="pill pill-low">منخفض</span>');
    expect(riskPill('متوسط')).toBe('<span class="pill pill-mid">متوسط</span>');
    expect(riskPill('عالي')).toBe('<span class="pill pill-high">عالي</span>');
  });

  test('defaults to "low" for unknown values', () => {
    expect(riskPill('غير معروف')).toBe('<span class="pill pill-low">غير معروف</span>');
  });

  test('shows dash when falsy', () => {
    expect(riskPill('')).toBe('<span class="pill pill-low">—</span>');
    expect(riskPill(null)).toBe('<span class="pill pill-low">—</span>');
    expect(riskPill(undefined)).toBe('<span class="pill pill-low">—</span>');
  });
});

describe('statusPill', () => {
  test('active status gets pill-active class', () => {
    expect(statusPill('نشطة')).toBe('<span class="pill pill-active">نشطة</span>');
  });

  test('received status gets pill-done class', () => {
    expect(statusPill('مستلمة')).toBe('<span class="pill pill-done">مستلمة</span>');
  });

  test('other statuses get generic pill', () => {
    expect(statusPill('معلقة')).toBe('<span class="pill">معلقة</span>');
  });

  test('trims whitespace', () => {
    expect(statusPill('  نشطة  ')).toBe('<span class="pill pill-active">نشطة</span>');
  });

  test('handles empty/null', () => {
    expect(statusPill('')).toBe('<span class="pill"></span>');
    expect(statusPill(null)).toBe('<span class="pill"></span>');
  });
});

describe('typePill', () => {
  test('maps Arabic types to CSS classes', () => {
    expect(typePill('صك')).toBe('<span class="pill pill-sukuk">صك</span>');
    expect(typePill('صندوق')).toBe('<span class="pill pill-fund">صندوق</span>');
    expect(typePill('سهم')).toBe('<span class="pill pill-stock">سهم</span>');
    expect(typePill('سند')).toBe('<span class="pill pill-bond">سند</span>');
  });

  test('defaults to sukuk class for unknown types', () => {
    expect(typePill('عقار')).toBe('<span class="pill pill-sukuk">عقار</span>');
  });
});

describe('badge', () => {
  test('synced state', () => {
    expect(badge('synced')).toContain('badge-ok');
    expect(badge('synced')).toContain('محدّث');
  });

  test('saving state', () => {
    expect(badge('saving')).toContain('badge-saving');
  });

  test('error state', () => {
    expect(badge('error')).toContain('badge-err');
  });

  test('offline state', () => {
    expect(badge('offline')).toContain('badge-off');
  });

  test('unknown state returns empty string', () => {
    expect(badge('unknown')).toBe('');
    expect(badge('')).toBe('');
  });
});
