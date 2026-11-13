// Lesson 69 — Dashboard Design & UX
// Realistic KPI numbers for "manzooma_sales_2026.xlsx" — 50,000 transactions.

export const KPI = [
  {
    label: 'إجمالي المبيعات',
    sub: 'Total Revenue',
    value: 12_847_500,
    suffix: ' ج.م',
    arrow: 14.2,
    spark: [38, 42, 39, 51, 48, 56, 62, 58, 67, 72, 78, 84],
    color: '#10B981',
    fmt: 'currency',
  },
  {
    label: 'صافي الربح',
    sub: 'Net Profit',
    value: 3_212_900,
    suffix: ' ج.م',
    arrow: 9.8,
    spark: [22, 25, 21, 28, 30, 33, 31, 36, 38, 41, 44, 47],
    color: '#38BDF8',
    fmt: 'currency',
  },
  {
    label: 'هامش الربح',
    sub: 'Profit Margin',
    value: 25.0,
    suffix: '%',
    arrow: -1.4,
    spark: [27, 26, 28, 26, 25, 26, 25, 24, 25, 25, 26, 25],
    color: '#A855F7',
    fmt: 'percent',
  },
  {
    label: 'معدل النمو',
    sub: 'YoY Growth',
    value: 14.2,
    suffix: '%',
    arrow: 14.2,
    spark: [4, 6, 5, 8, 7, 9, 11, 10, 12, 13, 14, 14],
    color: '#F59E0B',
    fmt: 'percent',
  },
];

export const BRANCHES = [
  {name: 'القاهرة', short: 'CAI', sales: 4_120_000, pct: 32.1},
  {name: 'الإسكندرية', short: 'ALX', sales: 2_890_000, pct: 22.5},
  {name: 'الجيزة', short: 'GIZ', sales: 2_410_000, pct: 18.8},
  {name: 'المنصورة', short: 'MNS', sales: 1_540_000, pct: 12.0},
  {name: 'طنطا', short: 'TNT', sales: 1_080_000, pct: 8.4},
  {name: 'أسيوط', short: 'ASY', sales: 807_500, pct: 6.3},
];

export const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

// Monthly revenue trend (in millions) — used by the line chart
export const TREND = [
  {m: 'ينا', v: 820},
  {m: 'فبر', v: 880},
  {m: 'مار', v: 760},
  {m: 'أبر', v: 1040},
  {m: 'ماي', v: 1180},
  {m: 'يون', v: 1120},
  {m: 'يول', v: 1320},
  {m: 'أغس', v: 1280},
  {m: 'سبت', v: 1180},
  {m: 'أكت', v: 1340},
  {m: 'نوف', v: 1420},
  {m: 'ديس', v: 1510},
];

// Branch share (for bar chart) — in thousands
export const BRANCH_SHARE = BRANCHES.map((b) => ({m: b.short, v: b.sales / 1000, full: b.name}));

// Category split (for donut)
export const CATEGORIES = [
  {name: 'إلكترونيات', value: 4_980_000, color: '#38BDF8'},
  {name: 'أجهزة منزلية', value: 3_240_000, color: '#10B981'},
  {name: 'إكسسوارات', value: 2_180_000, color: '#A855F7'},
  {name: 'ملابس', value: 1_620_000, color: '#F59E0B'},
  {name: 'أخرى', value: 827_500, color: '#94A3B8'},
];

export const fmt = (v: number, kind: 'currency' | 'percent' | 'int' = 'int') => {
  if (kind === 'currency') return v.toLocaleString('en-US');
  if (kind === 'percent') return v.toFixed(1);
  return v.toLocaleString('en-US');
};

export const fmtCompact = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
  return v.toString();
};
