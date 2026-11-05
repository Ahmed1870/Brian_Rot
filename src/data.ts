// manzooma_store_db — Lesson 42 dataset

/** Daily revenue for window frame demos (Scene 1, 3, 5). */
export const DAILY_REVENUE: {day: number; date: string; amount: number}[] = [
  {day: 1, date: '2024-06-01', amount: 1200},
  {day: 2, date: '2024-06-02', amount: 950},
  {day: 3, date: '2024-06-03', amount: 1450},
  {day: 4, date: '2024-06-04', amount: 800},
  {day: 5, date: '2024-06-05', amount: 1600},
  {day: 6, date: '2024-06-06', amount: 1100},
  {day: 7, date: '2024-06-07', amount: 1850},
  {day: 8, date: '2024-06-08', amount: 1300},
];

/** Precomputed running totals. */
export const RUNNING_TOTALS: number[] = DAILY_REVENUE.reduce<number[]>((acc, row, i) => {
  acc.push((acc[i - 1] ?? 0) + row.amount);
  return acc;
}, []);

/** Data with duplicate dates for ROWS vs RANGE comparison (Scene 2). */
export const DUPLICATE_DATES: {row: number; date: string; amount: number}[] = [
  {row: 1, date: '2024-01-10', amount: 500},
  {row: 2, date: '2024-01-12', amount: 700},
  {row: 3, date: '2024-01-15', amount: 300},
  {row: 4, date: '2024-01-15', amount: 400},
  {row: 5, date: '2024-01-15', amount: 250},
  {row: 6, date: '2024-01-18', amount: 600},
  {row: 7, date: '2024-01-20', amount: 800},
];

/** Precomputed 5-day smoothed averages (3 PRECEDING + CURRENT + 1 FOLLOWING). */
export const SMOOTHED_5DAY: number[] = DAILY_REVENUE.map((row, i) => {
  const start = Math.max(0, i - 3);
  const end = Math.min(DAILY_REVENUE.length - 1, i + 1);
  const window = DAILY_REVENUE.slice(start, end + 1);
  const sum = window.reduce((a, b) => a + b.amount, 0);
  return Math.round((sum / window.length) * 100) / 100;
});
